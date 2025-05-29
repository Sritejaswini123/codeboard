import { z, ZodError } from "zod";

import type { Commit, NewCommit } from "../database/schemas/commits";

import { COMMIT_CREATED, COMMIT_DELETED, COMMIT_EXIST, COMMIT_ID_REQUIRED, COMMIT_NOT_FOUND, COMMIT_UPDATED, COMMITS_FETCHED, VALIDATION_ERRORS } from "../constants/appMessages";
import {
  BAD_REQUEST,
  CREATED,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  OK,
  UNPROCESSABLE_ENTITY,
} from "../constants/httpStatusCodes";
import { commits } from "../database/schemas/commits";
import NotFoundException from "../exceptions/notFoundException";
import factory from "../factory";
import {
  createRecord,
  deleteRecordById,
  getRecordById,
  updateRecordById,
} from "../service/baseDbServices";
import { checkCommitExist, getAllCommits } from "../service/commitService";
import { sendResponse } from "../utils/sendResponse";
import { vCreateCommit } from "../validations/commitValidations";

// create commit
export const createCommitHandlers = factory.createHandlers(async (c) => {
  try {
    const reqBody = await c.req.json();

    const validatedCommitData = vCreateCommit.parse(reqBody);

    const commitData: NewCommit = {
      ...validatedCommitData,
      date: new Date(validatedCommitData.date),
    };
    const commitExist = checkCommitExist(validatedCommitData.project_id);
    if (!commitExist) {
      throw new NotFoundException(COMMIT_EXIST);
    }
    const commit = await createRecord<Commit>(commits, commitData);
    return sendResponse(c, CREATED, COMMIT_CREATED, commit);
  }
  catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = Object.fromEntries(
        error.errors.map(({ path, message }) => [path[0], message]),
      );
      return sendResponse(
        c,
        UNPROCESSABLE_ENTITY,
        VALIDATION_ERRORS,
        formattedErrors,
      );
    }

    throw error;
  }
});

// getAll Commits
export const getAllCommitsHandlers = factory.createHandlers(async (c) => {
  try {
    const page = Number(c.req.query("page"));

    const page_size = Number(c.req.query("page_size"));
    const project_id = c.req.query("project_id")
      ? Number(c.req.query("project_id"))
      : undefined;
    const user_id = c.req.query("user_id")
      ? Number(c.req.query("user_id"))
      : undefined;
    const repository_id = c.req.query("repository_id")
      ? Number(c.req.query("repository_id"))
      : undefined;
    const commits = await getAllCommits(
      page,
      page_size,
      project_id,
      user_id,
      repository_id,
    );

    if (!commits) {
      throw new NotFoundException("No commits found matching the criteria");
    }
    return sendResponse(c, OK, COMMITS_FETCHED, commits);
  }
  catch (error) {
    throw error;
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
    const reqBody = await c.req.json();
    const validatedCommit = vCreateCommit.parse(reqBody);
    const updatedProject: NewCommit = {
      ...validatedCommit,
      date: new Date(validatedCommit.date),
    };
    const updatedCommitResult = await updateRecordById(
      commits,
      updatedProject,
      commitId,
    );
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
    if (!commitId)
      return sendResponse(c, BAD_REQUEST, COMMIT_ID_REQUIRED);

    const isCommitIdExist = await checkCommitExist(commitId);

    if (!isCommitIdExist)
      throw new NotFoundException(COMMIT_NOT_FOUND);

    const deletedCommit = await deleteRecordById(commits, commitId);
    return sendResponse(c, OK, COMMIT_DELETED, deletedCommit);
  }
  catch (error) {
    throw error;
  }
});