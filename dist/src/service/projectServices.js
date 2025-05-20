export {};
// //save user 
// export const createProject=async (userData: NewProject)=>{
//     const  user =await db.insert(projects).values(userData).returning();
//     return user[0];
// }
// export const isProjectExist=async(title:string)=>{
//    const existingProject=await db
//       .select()
//       .from(projects)
//       .where(eq(projects.title,title))
//   return existingProject;
// }
