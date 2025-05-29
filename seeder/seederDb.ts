<<<<<<< HEAD
import { eq } from "drizzle-orm";

import type { Commit, CommitsTable } from "../src/database/schemas/commits";
import type { Project, ProjectsTable } from "../src/database/schemas/projects";
import type { UsersTable } from "../src/database/schemas/users";

import db from "../src/database/db";
import { commits } from "../src/database/schemas/commits";
import { projects } from "../src/database/schemas/projects";

type DBTable = UsersTable | ProjectsTable | CommitsTable;
=======
import type { UsersTable } from "../src/database/schemas/users";

import db from "../src/database/db";

type DBTable = UsersTable;
>>>>>>> 017e6737290c9832a0f859a94590d3b404d6e14d
export async function createRecordMany<T>(table: any, records: T[]) {
  return await db.insert(table).values(records).returning();
}
// create the project
export async function createProjectRecord(project: Project) {
  return await db.insert(projects).values(project).returning();
}
// delete the project by project id
export async function deleteProjectById(projectId: number) {
  return await db.delete(projects).where(eq(projects.id, projectId));
}
// create the commit
export async function createCommitRecord(commit: Commit) {
  return await db.insert(commits).values(commit).returning();
}
// delete commit by commit id
export async function deleteCommitById(commitId: number) {
  return await db.delete(commits).where(eq(commits.id, commitId));
}
