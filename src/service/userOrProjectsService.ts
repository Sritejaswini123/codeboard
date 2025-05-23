import { eq } from "drizzle-orm";
import db from "../database/db";
import { projects } from "../database/schemas/projects";
import { user_projects } from "../database/schemas/userProjects";
import { users } from "../database/schemas/users";
import { USER_NOT_FOUND } from "../constants/appMessages";
import { getRecordById } from "./baseDbServices";

// Get user by id (without projects)
export function getUserById(userId: number) {
  return getRecordById(users, userId);
}

// Get user by id with projects
export const getUserWithProjectsById = async (userId: number) => {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, userId));

  if (user.length === 0) {
    return USER_NOT_FOUND;
  }

  const userProjects = await db
    .select({
      id: projects.id,
      name: projects.title,
      description: projects.description,
      is_active: projects.is_active,
    })
    .from(user_projects)
    .innerJoin(projects, eq(user_projects.project_id, projects.id))
    .where(eq(user_projects.user_id, userId));

  return {
    user: user[0],
    userProjects: userProjects.length > 0 ? userProjects : [],
  };
};

// Get user by id with optional projects
export const getUserByIdWithOptionalProjects = async (userId: number, includeProjects: boolean) => {
  try {
    const user = await db
    .select()
    .from(users)
    .where(eq(users.id, userId));

  if (user.length === 0) {
    return USER_NOT_FOUND;
  }

  if (!includeProjects) {
    return { user: user[0] };
  }

  const userProjects = await db
    .select({
      id: projects.id,
      name: projects.title,
      description: projects.description,
      is_active: projects.is_active,
    })
    .from(user_projects)
    .innerJoin(projects, eq(user_projects.project_id, projects.id))
    .where(eq(user_projects.user_id, userId));

  return {
    user: user[0],
    userProjects: userProjects.length > 0 ? userProjects : [],
  };
  } catch (error) {
    throw  error;
  }
  
};
