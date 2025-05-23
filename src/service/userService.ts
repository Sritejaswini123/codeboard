// user service
import type { NewUser, User, UsersTable } from "../database/schemas/users.js";

import db from "../database/db.js";
import { users } from "../database/schemas/users.js";
import { deleteRecordById, getAllRecords, getRecordById, updateRecordById } from "./baseDbServices.js";
import { count, eq } from "drizzle-orm";
import { projects } from "../database/schemas/projects.js";
import { user_projects } from "../database/schemas/userProjects.js";

// save user
export const createUser = async (userData: NewUser) => {
  const user = await db.insert(users).values(userData).returning();
  return user[0];
}

//get users with projects
export const getUserWithProjects = async (
  userId: number,
  page: number,
  page_size: number,
  includeProjects: boolean = false
) => {
  const offset = (page - 1) * page_size;

  // Fetch user data
  const userResult = await db
    .select({
      id: users.id,
      name: users.first_name,
      email: users.email,
    })
    .from(users)
    .where(eq(users.id, userId));

  if (userResult.length === 0) {
    return null;
  }

  const user = userResult[0];

  if (!includeProjects) {
    return { user };
  }

  // Fetch paginated projects
  const projectsResult = await db
    .select({
      id: projects.id,
      title: projects.title,
      description: projects.description,
      is_active: projects.is_active,
      created_at: projects.created_at,
      updated_at: projects.updated_at,
    })
    .from(user_projects)
    .innerJoin(projects, eq(user_projects.project_id, projects.id))
    .where(eq(user_projects.user_id, userId))
    .limit(page_size)
    .offset(offset);
  // Count total matching records for pagination
  const [{ total }] = await db
    .select({ total: count() })
    .from(user_projects)
    .innerJoin(projects, eq(projects.id, user_projects.project_id))
    .innerJoin(users, eq(users.id, user_projects.user_id))
    .where(eq(user_projects.user_id, userId))

  const totalPages = Math.ceil(total / page_size);

  return {
    total_records: total,
    page,
    page_size,
    totalPages,
    next_page: page < totalPages ? page + 1 : null,
    prev_page: page > 1 ? page - 1 : null,
    user,
    projects: projectsResult
  };
};
// get all users
export async function getAllUsers(page: number, page_size: number, users: UsersTable, filter: any) {
  return await getAllRecords(page, page_size, users, filter);
}

// delete user by id
export async function deleteUserById(userId: number) {
  return await deleteRecordById(users, userId);
}
//update userby id
export async function updateUserById(userId: number, userData: NewUser) {
  return await updateRecordById(users, userData, userId);
}