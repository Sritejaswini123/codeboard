import factory from "../factory.js";
import { createUserHandlers, deleteUserByIdHandlers, getAllUsersHandlers, getUserByIdHandlers, updateUserByIdHandlers } from "../handlers/userHandlers.js";
const userRoutes = factory.createApp();
userRoutes.post("/users", ...createUserHandlers);
userRoutes.get("/users", ...getAllUsersHandlers);
userRoutes.get("/users/:user_id", ...getUserByIdHandlers);
userRoutes.patch("/users/:user_id", ...updateUserByIdHandlers);
userRoutes.delete("/users/:user_id", ...deleteUserByIdHandlers);
export default userRoutes;
