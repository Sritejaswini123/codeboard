import factory from "../factory";
import { getUserByIdHandlers } from "../handlers/userProjectHandlers";

const userProjectRoutes = factory.createApp();
userProjectRoutes.get("/users/:user_id", ...getUserByIdHandlers);
export default userProjectRoutes;
