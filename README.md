```
npm install
npm run dev
```

```
open http://localhost:3000
```

<!--
export const userRelations = relations(users, ({ many }) => ({
  projects: many(projects, {
    relationName: "userProjects",
    fields: [users.id],
    references: [projects.assigned_to],
  }),
})); -->


// export const createUserProjectHandler=factory.createHandlers(async(c)=>{
//     try {
//         const reqBody=await c.req.json();
//         const validatedUserProject=vCreateuserProject.parse(reqBody);
//         const userProjectData:NewUserProject={
//             ...validatedUserProject,
//         }
//         const userProjectId=userProjectData.id;
        
//         if(userProjectId!=undefined){
//             const userProjectExistence=userProjectExist(userProjectId);
//         }
//     } catch (error) {
        
//     }
// })


