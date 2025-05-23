// import { ZodError } from "zod";

// import type { Commit, NewCommit } from "../database/schemas/commits";

// import { COMMIT_CREATED, COMMIT_NOT_FOUND, COMMITS_FETCHED } from "../constants/appMessages";
// import { CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, UNPROCESSABLE_ENTITY } from "../constants/httpStatusCodes";
// import { commits } from "../database/schemas/commits";
// import factory from "../factory";
// import { createRecord } from "../service/baseDbServices";
// import { getAllCommits } from "../service/commitService";
// import { sendResponse } from "../utils/sendResponse";
// import { vCreateCommit } from "../validations/commitValidations";

// // Create Commit
// export const createCommitHandlers = factory.createHandlers(async (c) => {
//   try {
//     const reqBody = await c.req.json();
//     const validCommitReq = vCreateCommit.parse(reqBody);

//     const commitData: NewCommit = {
//       ...validCommitReq,
//     };

//     const commit = await createRecord<Commit>(commits, commitData);

//     return sendResponse(c, CREATED, COMMIT_CREATED, commit);
//   }
//   catch (error) {
//     if (error instanceof ZodError) {
//       const errorMessage = error.errors?.[0]?.message || "Validation error";
//       return c.json({ message: errorMessage }, NOT_FOUND);
//     }

//     return c.json({ error }, UNPROCESSABLE_ENTITY);
//   }
// });

// // //getCommitById
// // export const getCommitByIdHandlers = factory.createHandlers(async (c) => {
// //   try {
// //     const commitId = Number(c.req.param('commit_id'));

// //     if (!commitId) {
// //       return sendResponse(c, BAD_REQUEST, COMMIT_ID_REQUIRED);
// //     }
// //     const commit= await getRecordById(commits,commitId);

// //       if (!commit) {
// //         throw new NotFoundException(COMMIT_NOT_FOUND);
// //       }
// //     return sendResponse(c, OK, COMMITS_FETCHED, commit);
// //   } catch (error) {
// //     return sendResponse(c, INTERNAL_SERVER_ERROR, COMMIT_NOT_FOUND);
// //   }
// // });

// // getAll Commits
// export const getAllCommitsHandlers = factory.createHandlers(async (c) => {
//   try {
//     const page = Number(c.req.query("page"));
//     const page_size = Number(c.req.query("page_size"));
//     const project_id = c.req.query("project_id") ? Number(c.req.query("project_id")) : undefined;
//     const user_id = c.req.query("user_id") ? Number(c.req.query("user_id")) : undefined;

//     const commit = await getAllCommits(page, page_size, project_id, user_id);

//     return sendResponse(c, OK, COMMITS_FETCHED, commit);
//   }
//   catch (error: any) {
//     if (error.message === "User not found" || error.message === "Project not found" || error.message === "User is not assigned to the specified project") {
//       return sendResponse(c, NOT_FOUND, error.message);
//     }

//     return sendResponse(c, INTERNAL_SERVER_ERROR, COMMIT_NOT_FOUND);
//   }
// });
