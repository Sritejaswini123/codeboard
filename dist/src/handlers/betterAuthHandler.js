import factory from "../factory";
import { auth } from "../libs/auth";
import { sendResponse } from "../utils/sendResponse";
import { OK } from "../constants/httpStatusCodes";
import { EMAIL_PASSWORD } from "../constants/appMessages";
import conflictException from "../exceptions/conflictException";
//signin the user 
import db from "../database/db";
import { authUsers } from "../database/schemas/authSchema";
export const signUpHandler = factory.createHandlers(async (c) => {
    const { email, password, first_name, phone, dob, doj, designation, } = await c.req.json();
    if (!email || !password || !first_name || !dob || !doj || !designation) {
        return c.json({ error: "Missing required fields" }, 400);
    }
    const response = await auth.api.signUpEmail({
        body: { email, password, name: first_name },
        asResponse: true,
    });
    const responseData = await response.json();
    const betterAuthUserId = responseData.user.id;
    // Insert additional data into your own table
    const inserted = await db.insert(authUsers).values({
        id: betterAuthUserId,
        first_name,
        phone,
        dob: new Date(dob),
        doj: new Date(doj),
        designation,
    }).returning();
    return c.json({
        message: "User registered with additional fields",
        betterAuthUserId,
        internalId: inserted[0].internalId,
    }, 201);
});
// //register the user with email and password
// export const signUpHandler = factory.createHandlers(async (c: Context) => {
//   try {
//     const { email, password, name } = await c.req.json();
//     if (!email || !password) {
//       throw new conflictException(EMAIL_PASSWORD);
//     }
//     const response = await auth.api.signUpEmail({
//       body: { email, password, name },
//       asResponse: true,
//     });
//     return sendResponse(c, CREATED, USER_CREATED, { email, name });
//   } catch (error) {
//     throw error;
//   }
// });
//login the user with email and password
export const signInHandler = factory.createHandlers(async (c) => {
    try {
        const { email, password } = await c.req.json();
        if (!email || !password) {
            throw new conflictException(EMAIL_PASSWORD);
        }
        const response = await auth.api.signInEmail({
            body: { email, password },
            asResponse: true,
        });
        return sendResponse(c, OK, "User signed in successfully", {});
    }
    catch (error) {
        throw error;
    }
});
//sign out the user
export const signOutWithSessionHandler = factory.createHandlers(async (c) => {
    try {
        const { session_token } = await c.req.json();
        if (!session_token) {
            throw new conflictException("Session token is required");
        }
        // Validate if the session token exists in the database and is not expired
        const pool = auth.options.database;
        const sessionQuery = await pool.query('SELECT id, token, "expiresAt" FROM session WHERE token = $1 AND "expiresAt" > NOW()', [session_token]);
        if (sessionQuery.rows.length === 0) {
            throw new conflictException("Invalid or expired session token");
        }
        const response = await auth.api.signOut({
            headers: {
                'Authorization': `Bearer ${session_token}`,
                'Cookie': `better-auth.session_token=${session_token}`
            },
            asResponse: true,
        });
        return sendResponse(c, OK, "User signed out successfully", {
            sessionId: sessionQuery.rows[0].id
        });
    }
    catch (error) {
        throw error;
    }
});
// Backend handler for user sign out with token revocation
export const signOutWithSessionHandler2 = factory.createHandlers(async (c) => {
    try {
        const { session_token } = await c.req.json();
        if (!session_token) {
            throw new conflictException("Session token is required");
        }
        const pool = auth.options.database;
        const sessionQuery = await pool.query('SELECT id, token, "userId", "expiresAt" FROM session WHERE token = $1 AND "expiresAt" > NOW()', [session_token]);
        if (sessionQuery.rows.length === 0) {
            throw new conflictException("Invalid or expired session token");
        }
        return sendResponse(c, OK, "User signed out successfully", {
            sessionId: sessionQuery.rows[0].id
        });
    }
    catch (error) {
        throw error;
    }
});
// sign out the user and revoke the session
export const signOutHandler = factory.createHandlers(async (c) => {
    try {
        const { session_token } = await c.req.json();
        if (!session_token) {
            throw new conflictException("Session token is required");
        }
        // Revoke session using Better Auth's signOut API
        await auth.api.signOut({
            headers: {
                Authorization: `Bearer ${session_token}`,
                Cookie: `better-auth.session_token=${session_token}`,
            },
            asResponse: true,
        });
        return sendResponse(c, OK, "User signed out and session revoked successfully", {});
    }
    catch (error) {
        throw error;
    }
});
