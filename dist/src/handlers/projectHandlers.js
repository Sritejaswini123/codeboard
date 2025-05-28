// import { eq } from "drizzle-orm";
// import { ZodError } from "zod";
export {};
// createproject
// export const createProjectHandlers = factory.createHandlers(async (c) => {
//   try {
//     const reqBody = await c.req.json();
//     const validProjectReq = vCreateProject.parse(reqBody);
//     const projectData: NewProject = {
//       ...validProjectReq,
//     };
//     const existingProject = await isProjectExist(validProjectReq.title);
//     if (!existingProject) {
//       throw new NotFoundException(PROJECT_EXIST);
//     }
//     const Projcet = await createRecord<Project>(projects, projectData);
//     return sendResponse(c, CREATED, PROJECT_CREATED, Projcet);
//   }
//   catch (error) {
//      if (error instanceof z.ZodError) {
//           const formattedErrors = Object.fromEntries(
//             error.errors.map(({path,message})=>[path[0],message])
//           );
//           return sendResponse(c, UNPROCESSABLE_ENTITY,VALIDATION_ERRORS,formattedErrors);
//         }
//     throw error;
//   }
// },
// );
//createproject
// export const createProjectHandlers = factory.createHandlers(async (c) => {
//   try {
//     const reqBody = await c.req.json();
//     const validProjectReq = vCreateProject.parse(reqBody);
//     const project = await createNewProject( validProjectReq);
//     return sendResponse(c, CREATED, PROJECT_CREATED, project);
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       const formattedErrors = Object.fromEntries(
//         error.errors.map(({ path, message }) => [path[0], message])
//       );
//       return sendResponse(c, UNPROCESSABLE_ENTITY, "Validation errors", formattedErrors);
//     }
//     throw error;
//   }
// });
// // get all projects handler
// export const getAllProjectsHandlers = factory.createHandlers(async (c) => {
//   try {
//     const page = Number(c.req.query("page"));
//     const page_size = Number(c.req.query("page_size"));
//     const user_id = Number(c.req.query("user_id"));
//     const project_id = Number(c.req.query("project_id"));
//     const projectData = await getAllProjects(page, page_size, user_id, project_id);
//     return sendResponse(c, OK, PROJECTS_FETCHED, projectData);
//   }
//   catch (error) {
//     return sendResponse(c, INTERNAL_SERVER_ERROR, PROJECT_NOT_FOUND);
//   }
// });
