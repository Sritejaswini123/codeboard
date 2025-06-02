// realSeedServices.ts

import { inArray } from "drizzle-orm";
import db from "../database/db";
import { projects } from "../database/schemas/projects";
import { repositories } from "../database/schemas/repositories";
import { users } from "../database/schemas/users";

export async function getExistingEmails(emails: string[]) {
  const existingUsers = await db
    .select({ email: users.email })
    .from(users)
    .where(inArray(users.email, emails));
  return new Set(existingUsers.map(u => u.email));
}

// checking if the project names already exists in the database for projects
export async function getExistingProjectNames(projectNames: string[]) {
  const existingProjects = await db
    .select({ name: projects.title })
    .from(projects)
    .where(inArray(projects.title, projectNames));
  return new Set(existingProjects.map(p => p.name));
}

// checking if the repository names already exists in the database for repositories
export async function getExistingRepositoryNames(repositoryNames: string[]) {
  const existingRepositories = await db
    .select({ name: repositories.title })
    .from(repositories)
    .where(inArray(repositories.title, repositoryNames));
  return new Set(existingRepositories.map(r => r.name));
}
