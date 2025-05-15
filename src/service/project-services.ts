import { projects } from "../database/schemas/projects";
import { getAllRecords, getRecordById } from "./base-db-services";

// get projects by id
export function getProjectById(projectId: number) {
  return getRecordById(projects, projectId);
}
// get all projects
export async function getAllProjects(page_no: number,page_size: number) {
  return await getAllRecords(page_no,page_size, projects);
}