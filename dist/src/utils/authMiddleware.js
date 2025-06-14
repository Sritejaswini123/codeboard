import { verify } from 'hono/jwt';
import { UNAUTHORIZED } from "../constants/httpStatusCodes";
import { sendResponse } from "./sendResponse";
const JWT_SECRET = 'shivaji@kalyan';
export const authMiddleware = async (c, next) => {
    try {
        const authHeader = c.req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return sendResponse(c, UNAUTHORIZED, 'Authorization token missing or invalid');
        }
        const token = authHeader.split(' ')[1];
        const decode = await verify(token, JWT_SECRET);
        c.set('user', decode);
        await next();
    }
    catch (error) {
        return sendResponse(c, UNAUTHORIZED, 'Invalid or expired token');
    }
};
