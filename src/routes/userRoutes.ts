import factory from "../factory.js";
import { createUserHandlers, deleteUserByIdHandlers, getAllUsersHandlers, updateUserByIdHandlers } from "../handlers/userHandlers.js";

const userRoutes = factory.createApp();
userRoutes.post("/users", ...createUserHandlers);
// userRoutes.get("/users/:user_id", ...getUserByIdHandlers);
userRoutes.get("/users", ...getAllUsersHandlers);
userRoutes.patch("/users/:user_id", ...updateUserByIdHandlers);
userRoutes.delete("/users/:user_id", ...deleteUserByIdHandlers);



export default userRoutes;
