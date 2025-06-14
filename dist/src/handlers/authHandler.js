import bcrypt from "bcrypt";
import { sign, verify } from "hono/jwt";
import { AUTH_HEADER_MISSING, USER_NOT_FOUND } from "../constants/appMessages";
import { CREATED } from "../constants/httpStatusCodes";
import BadRequestException from "../exceptions/badRequestException";
import NotFoundException from "../exceptions/notFoundException";
import factory from "../factory";
import { sendResponse } from "../utils/sendResponse";
//replace it with db storages
const usersData = [
    {
        id: 1,
        name: "shivaji123",
        password: await bcrypt.hash("shiv1234@1212jl", 10),
        role: "admin"
    },
    {
        id: 2,
        name: "suku",
        password: await bcrypt.hash("suku1234", 10),
        role: "user"
    },
    {
        id: 3,
        name: "balu",
        password: await bcrypt.hash("balu1234", 10),
        role: "user"
    },
    {
        id: 4,
        name: "vamsi",
        password: await bcrypt.hash("vamsi1234", 10),
        role: "user"
    },
    {
        id: 5,
        name: "veera",
        password: await bcrypt.hash("veera", 10),
        role: "user"
    }
];
const JWT_SECRET = "shivaji@kalyan";
const ACCESS_TOKEN_EXP = 60 * 0.5;
const REFRESH_TOKEN_EXP = 60 * 45;
// Login route handler
// export const login = factory.createHandlers(async (c: Context) => {
//   try {
//     const { name, password, } = await c.req.json();
//     const user = usersData.find((u) => u.name === name);//checks if the data present in db or not
//     if(!user){
//       throw new NotFoundException(USER_NOT_FOUND);
//     } 
//     const isPasswordCorrect = await argon2.verify(password, user.password);
//     if(!isPasswordCorrect) {
//       throw new NotFoundException(USER_NOT_FOUND);
//     }
//     const payload = {
//       id:user.id,
//       username: user.name,
//       role: user.role,
//       exp: Math.floor(Date.now() / 1000) + 60
//     };
//     const token = await sign(payload, JWT_SECRET);
//     return sendResponse(c, 200, "Token generated successfully", { token });
//   } catch (error) {
//     throw error;
//   }
// });
// Login route handler
export const login = factory.createHandlers(async (c) => {
    try {
        const { name, password, } = await c.req.json();
        const user = usersData.find((u) => u.name === name); //checks if the data present in db or not
        if (!user) {
            throw new NotFoundException(USER_NOT_FOUND);
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            throw new NotFoundException(USER_NOT_FOUND);
        }
        const payload = {
            id: user.id,
            username: user.name,
            role: user.role,
        };
        const accesToken = await sign({
            ...payload,
            exp: Math.floor(Date.now() / 1000) + ACCESS_TOKEN_EXP
        }, JWT_SECRET);
        const refreshToken = await sign({
            ...payload, exp: Math.floor(Date.now() / 1000) + REFRESH_TOKEN_EXP
        }, JWT_SECRET);
        return sendResponse(c, 201, "Tokens generated successfully", { accesToken, refreshToken });
    }
    catch (error) {
        throw error;
    }
});
// Profile route (protected)
export const profile = factory.createHandlers(async (c) => {
    try {
        const user = c.get("user");
        return sendResponse(c, CREATED, "User profile fetched", { user: user });
    }
    catch (error) {
        throw error;
    }
});
//Refresh token 
export const refreshTokenHandler = factory.createHandlers(async (c) => {
    try {
        const authHeader = await c.req.header('Authorization');
        if (!authHeader) {
            throw new BadRequestException(AUTH_HEADER_MISSING);
        }
        const [bearer, token] = authHeader.split(' ');
        if (bearer !== 'Bearer' || !token) {
            throw new BadRequestException("Invalid Authorization header format");
        }
        const decoded = await verify(token, JWT_SECRET).catch(() => null);
        if (!decoded) {
            return sendResponse(c, 401, "Invalid or expired refresh token");
        }
        // Create new access token with short expiry
        const newAccessToken = await sign({
            id: decoded.id,
            username: decoded.username,
            role: decoded.role,
            exp: Math.floor(Date.now() / 1000) + ACCESS_TOKEN_EXP,
        }, JWT_SECRET);
        return sendResponse(c, 200, "Access token refreshed", { accessToken: newAccessToken });
    }
    catch (error) {
        if (error instanceof BadRequestException) {
            return sendResponse(c, 400, error.message);
        }
        throw error;
    }
});
