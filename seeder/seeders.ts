// Seeders
import { randBoolean, randEmail, randFirstName, randGitCommitMessage, randJobTitle, randLastName, randNumber, randParagraph, randPastDate, randPhoneNumber, randUrl,
} from "@ngneat/falso";
import type { NewCommit } from "../src/database/schemas/commits";
import type { NewProject } from "../src/database/schemas/projects";
import type { NewUserProject } from "../src/database/schemas/userProjects";
import type { NewUser } from "../src/database/schemas/users";
import db from "../src/database/db";
import { user_projects } from "../src/database/schemas/userProjects";
import { users } from "../src/database/schemas/users";
import { projects } from "../src/database/schemas/projects";
// userSeeder

export function generateFakeUsers(count = 100): NewUser[] {
  return Array.from({ length: count }).map((_, i) => {
    const dob = randPastDate({ years: 30 });
    const doj = randPastDate({ years: 10 });
    return {
      last_name: randLastName(),
      email: `user${i + 1}_${randEmail()}`,
      phone: randPhoneNumber(),
      first_name: randFirstName(),
      is_active: randBoolean(),
      dob,
      doj,
      designation: randJobTitle(),
      created_at: new Date(),
      updated_at: new Date(),
    };
  });
}

// projectSeeder
export function generateFakeProjects(count = 5): NewProject[] {
  return Array.from({ length: count }).map(() => ({
    title: randJobTitle(),
    description: randParagraph(),
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  }));
}

// userProjectSeeder
export async function generateFakeUserProjects(): Promise<NewUserProject[]> {
  const allUsers = await db.select().from(users);
  const allProjects = await db.select().from(projects);
  const userProjects: NewUserProject[] = [];
  let userIndex = 0;
  for (const project of allProjects) {
    for (let i = 0; i < 5; i++) {
      if (userIndex >= allUsers.length)
        break;
      userProjects.push({
        user_id: allUsers[userIndex].id,
        project_id: project.id,
        created_at: new Date(),
        updated_at: new Date(),
      });
      userIndex++;
    }
  }
  return userProjects;
}

// commitSeeder
export async function generateFakeCommits(commitsPerUser = 20): Promise<NewCommit[]> {
  const userProjects = await db.select().from(user_projects);
  const commits: NewCommit[] = [];

  for (const userProject of userProjects) {
    for (let i = 0; i < commitsPerUser; i++) {
      commits.push({
        user_project_id: userProject.id,
        lines_of_code: randNumber({ min: 10, max: 500 }),
        commit_link: randUrl(),
        commit_name: randGitCommitMessage(),
        created_at: new Date(),
        updated_at: new Date(),
      });
    }
  }

  return commits;
}
