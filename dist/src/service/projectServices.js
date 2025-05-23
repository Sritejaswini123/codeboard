"use strict";
// import { eq } from "drizzle-orm";
// import type { NewProject, ProjectsTable } from "../database/schemas/projects";
// import db from "../database/db";
// import { projects } from "../database/schemas/projects";
// import { getAllRecords, getRecordById } from "./baseDbServices";
// // get projects by id
// export function getProjectById(projectId: number) {
//   return getRecordById(projects, projectId);
// }
// // get all projects
// export async function getAllProjects(page: number, page_size: number, projects: ProjectsTable, filter: any) {
//   return await getAllRecords(page, page_size, projects, filter);
// }
// // create project
// export async function createProject(projectData: NewProject) {
//   const project = await db.insert(projects).values(projectData).returning();
//   return project[0];
// }
// export async function isProjectExist(title: string) {
//   const existingProject = await db
//     .select()
//     .from(projects)
//     .where(eq(projects.title, title));
//   return existingProject;
// }
