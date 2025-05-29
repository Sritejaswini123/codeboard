import { and, asc, count, eq } from "drizzle-orm";
import db from "../database/db";
import { projects } from "../database/schemas/projects";
import { user_projects } from "../database/schemas/userProjects";
import { users } from "../database/schemas/users";
import { USER_NOT_FOUND } from "../constants/appMessages";
// all projects
export async function getAllProjects(page, page_size, user_id, project_id) {
    const offset = (page - 1) * page_size;
    const conditions = [];
    if (user_id) {
        conditions.push(eq(users.id, user_id));
    }
    if (project_id) {
        conditions.push(eq(projects.id, project_id));
    }
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const projectData = await db
        .select({
        project_id: projects.id,
        project_name: projects.title,
        user_id: users.id,
        user_name: users.first_name,
        user_email: users.email,
    })
        .from(projects)
        .innerJoin(user_projects, eq(projects.id, user_projects.project_id))
        .innerJoin(users, eq(users.id, user_projects.user_id))
        .where(whereClause)
        .orderBy(asc(projects.id))
        .limit(page_size)
        .offset(offset);
    const [{ total }] = await db
        .select({ total: count() })
        .from(projects);
    const totalPages = Math.ceil(total / page_size);
    return {
        total_records: total,
        page,
        page_size,
        totalPages,
        next_page: page < totalPages ? page + 1 : null,
        prev_page: page > 1 ? page - 1 : null,
        data: projectData,
    };
}
export const createProject = async (projectData) => {
    const project = await db.insert(projects).values(projectData).returning();
    return project[0];
};
//project exist
export const isProjectExist = async (project_id) => {
    const existingProject = await db
        .select()
        .from(projects)
        .where(eq(projects.id, project_id));
    return existingProject.length > 0;
};
export async function getUserProjects(userId, includeProjects) {
    // one query to get user and optionally projects using join
    const rows = await db
        .select({
        userId: users.id,
        firstName: users.first_name,
        lastName: users.last_name,
        userEmail: users.email,
        userPhone: users.phone,
        is_active: users.is_active,
        doj: users.dob,
        dob: users.doj,
        projectId: projects.id,
        projectName: projects.title,
        projectDescription: projects.description,
        projectIsActive: projects.is_active,
    })
        .from(users)
        .leftJoin(user_projects, eq(users.id, user_projects.user_id))
        .leftJoin(projects, eq(user_projects.project_id, projects.id))
        .where(eq(users.id, userId));
    if (rows.length === 0 || rows[0].userId === undefined) {
        return USER_NOT_FOUND;
    }
    if (!includeProjects) {
        // return only user info
        return {
            user: {
                id: rows[0].userId,
                first_name: rows[0].firstName,
                last_name: rows[0].lastName,
                email: rows[0].userEmail,
                phone: rows[0].userPhone,
                doj: rows[0].dob,
                dob: rows[0].doj,
                is_active: rows[0].is_active,
            },
        };
    }
    // extract projects from rows
    const userProjects = rows
        // .filter(row => row.projectId !== null && row.projectId !== undefined)
        .map(row => ({
        id: row.projectId,
        name: row.projectName,
        description: row.projectDescription,
        is_active: row.projectIsActive,
    }));
    return {
        user: {
            id: rows[0].userId,
            first_name: rows[0].firstName,
            last_name: rows[0].lastName,
            email: rows[0].userEmail,
            phone: rows[0].userPhone,
            doj: rows[0].dob,
            dob: rows[0].doj,
            is_active: rows[0].is_active,
        },
        Total_projects: userProjects.length,
        userProjects: userProjects.length > 0 ? userProjects : [],
    };
}
