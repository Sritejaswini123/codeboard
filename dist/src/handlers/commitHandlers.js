import { ZodError } from "zod";
import { COMMIT_CREATED, COMMIT_DELETED, COMMIT_EXIST, COMMIT_ID_REQUIRED, COMMIT_NOT_FOUND, COMMIT_UPDATED, COMMITS_FETCHED } from "../constants/appMessages";
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, UNPROCESSABLE_ENTITY } from "../constants/httpStatusCodes";
import { commits } from "../database/schemas/commits";
import NotFoundException from "../exceptions/notFoundException";
import factory from "../factory";
import { createRecord, deleteRecordById, getRecordById, updateRecordById } from "../service/baseDbServices";
import { checkCommitExist, getAllCommits } from "../service/commitService";
import { sendResponse } from "../utils/sendResponse";
import { vCreateCommit } from "../validations/commitValidations";
// create commit
export const createCommitHandlers = factory.createHandlers(async (c) => {
    try {
        const reqBody = await c.req.json();
        const validatedCommitData = vCreateCommit.parse(reqBody);
        const commitData = {
            ...validatedCommitData,
        };
        const commitExist = checkCommitExist(validatedCommitData.user_project_id);
        if (!commitExist) {
            throw new NotFoundException(COMMIT_EXIST);
        }
        const commit = await createRecord(commits, commitData);
        return sendResponse(c, CREATED, COMMIT_CREATED, commit);
    }
    catch (error) {
        if (error instanceof ZodError) {
            const errorMessage = error.errors?.[0]?.message || "Validation error";
            return c.json({ message: errorMessage }, NOT_FOUND);
        }
        return c.json({ error }, UNPROCESSABLE_ENTITY);
    }
});
// getAll Commits
export const getAllCommitsHandlers = factory.createHandlers(async (c) => {
    try {
        const page = Number(c.req.query("page"));
        const page_size = Number(c.req.query("page_size"));
        const project_id = c.req.query("project_id") ? Number(c.req.query("project_id")) : undefined;
        const user_id = c.req.query("user_id") ? Number(c.req.query("user_id")) : undefined;
        const commit = await getAllCommits(page, page_size, project_id, user_id);
        return sendResponse(c, CREATED, COMMITS_FETCHED, commit);
    }
    catch (error) {
        if (error.message === "User not found" || error.message === "Project not found" || error.message === "User is not assigned to the specified project") {
            return sendResponse(c, NOT_FOUND, error.message);
        }
        return sendResponse(c, INTERNAL_SERVER_ERROR, COMMIT_NOT_FOUND);
    }
});
// getCommitById
export const getCommitByIdHandlers = factory.createHandlers(async (c) => {
    try {
        const commitId = Number(c.req.param("commit_id"));
        if (!commitId) {
            return sendResponse(c, BAD_REQUEST, COMMIT_ID_REQUIRED);
        }
        const commit = await getRecordById(commits, commitId);
        if (!commit) {
            throw new NotFoundException(COMMIT_NOT_FOUND);
        }
        return sendResponse(c, OK, COMMITS_FETCHED, commit);
    }
    catch (error) {
        return sendResponse(c, INTERNAL_SERVER_ERROR, COMMIT_NOT_FOUND);
    }
});
// update by id
export const updateCommitByIdHandlers = factory.createHandlers(async (c) => {
    try {
        const commitId = Number(c.req.param("id"));
        const reqBody = c.req.json();
        const validatedCommit = vCreateCommit.parse(reqBody);
        const updatedProject = {
            ...validatedCommit,
        };
        const updatedCommitResult = await updateRecordById(commits, updatedProject, commitId);
        return sendResponse(c, CREATED, COMMIT_UPDATED, updatedCommitResult);
    }
    catch (error) {
        if (error instanceof ZodError) {
            const errorMessage = error.errors?.[0]?.message || "Validation error";
            return c.json({ message: errorMessage }, NOT_FOUND);
        }
        return c.json({ error }, UNPROCESSABLE_ENTITY);
    }
});
// delete by id
export const deleteCommitByIdHandlers = factory.createHandlers(async (c) => {
    const commitId = Number(c.req.param("id"));
    try {
        if (!commitId) {
            return sendResponse(c, BAD_REQUEST, COMMIT_ID_REQUIRED);
        }
        const isCommitIdExist = await checkCommitExist(commitId);
        if (!isCommitIdExist) {
            throw new NotFoundException(COMMIT_NOT_FOUND);
        }
        const deletedCommit = await deleteRecordById(commits, commitId);
        return sendResponse(c, OK, COMMIT_DELETED, deletedCommit);
    }
    catch (error) {
        if (error instanceof ZodError) {
            const errorMessage = error.errors?.[0]?.message || "Validation error";
            return c.json({ message: errorMessage }, NOT_FOUND);
        }
        return c.json({ error }, UNPROCESSABLE_ENTITY);
    }
});
