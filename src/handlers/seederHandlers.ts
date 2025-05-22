import fs from 'fs/promises';
import path from "path";
import { Context } from "vm";
import { createRecordMany } from "../../seeder/seederDb";
import { generateFakeUsers } from "../../seeder/userSeeder";
import { CREATED } from "../constants/httpStatusCodes";
import db from "../database/db";
import { NewUserProject, user_projects } from '../database/schemas/userProjects';
import { NewUser, users } from "../database/schemas/users";
import factory from "../factory";
import { sendResponse } from "../utils/sendResponse";
import { commits, NewCommit } from '../database/schemas/commits';
import { vCreateCommit } from '../validations/commitValidations';
import { z } from 'zod';

export const seedUsersHandler = factory.createHandlers(async (c) => {
  try {
    const count = Number(c.req.query("count")) || 100;
    const fakeUsers = generateFakeUsers(count);
    const insertedUsers = await createRecordMany(users, fakeUsers);
    if (!Array.isArray(insertedUsers)) {
      throw new TypeError("User insertion failed");
    }
    return sendResponse(c, CREATED, `${insertedUsers.length} users created`, insertedUsers);
  }
  catch (error) {
    console.error("Seeder error:", error);
    return c.json({ error: "Failed to seed users" }, 500);
  }
});


export const seedRealUserBulkDataHandler = [ async (c: Context) => {
  try {
    const filePath = path.join(process.cwd(), "src", "data", "users.json");
    const jsonData = await fs.readFile(filePath, "utf-8");
    const parsed: any[] = JSON.parse(jsonData);

    const usersToInsert: NewUser[] = parsed.map(entry => ({
      ...entry,
      dob: new Date(entry.dob),
      doj: new Date(entry.doj),
    }));

    if (usersToInsert.length > 0) {
      await db.insert(users).values(usersToInsert);
    }

    return c.json({
      success: true,
      inserted: usersToInsert.length,
    });
  } catch (error) {
    console.error("Bulk insert seeding error:", error);
    return c.json({ success: false, message: "Failed to seed users" }, 500);
  }
}];


export const seedUserProjectsHandler = [ async (c: Context) => {
  try {
    const filePath = path.join(process.cwd(), "src", "data", "userProjects.json");
    const jsonData = await fs.readFile(filePath, "utf-8");
    const parsed: any[] = JSON.parse(jsonData);

    const userProjects: NewUserProject[] = parsed.map(entry => ({
      ...entry,
    }));

    if (userProjects.length > 0) {
      await db.insert(user_projects).values(userProjects);
    }

    return c.json({
      success: true,
      inserted: userProjects.length,
    });
  } catch (error) {
    console.error("User projects bulk insert seeding error:", error);
    return c.json({ success: false, message: "Failed to seed user projects" }, 500);
  }
}];






// export const seedCommitHandler=[async(c:Context)=>{
//   try {
//     const filePath=path.join(process.cwd(),"src","data","commits.json");
//     const jsonCommitData=await fs.readFile(filePath,"utf-8");
//     const parsedCommit:any[]=JSON.parse(jsonCommitData);
//     const commitData:NewCommit[]=parsedCommit.map(entry=>({
//       ...entry,
//     }))
//     if(commitData.length>0){
//       await db.insert(commits).values(commitData);
//     }
//     return c.json({
//       success: true,
//       inserted: commitData.length,
//     });
//   } catch (error) {
//      console.error("User projects bulk insert seeding error:", error);
//     return c.json({ success: false, message: "Failed to seed user projects" }, 500);
//   }
// }]




export const seedCommitHandler = [async (c: Context) => {
  try {
    const vCreateCommitArray = z.array(vCreateCommit);

    const filePath = path.join(process.cwd(), 'src', 'data', 'commits.json');
    const commitJsonData = await fs.readFile(filePath, 'utf-8');
    const parsedCommit: any[] = JSON.parse(commitJsonData);

    const validCommits: NewCommit[] = vCreateCommitArray.parse(parsedCommit);

    if (validCommits.length > 0) {
      await db.insert(commits).values(validCommits);
    }

    return c.json({
      success: true,
      inserted: validCommits.length,
    });
  } catch (error) {
    console.error('User commits bulk insert seeding error:', error);
    return c.json({ success: false, message: 'Failed to seed user commits', error: error instanceof Error ? error.message : String(error) }, 500);
  }
}];
