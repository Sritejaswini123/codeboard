import factory from "../factory.js";
import { seedRealUserHandler } from "../handlers/seedRealUserHandlers";

const seed = factory.createApp();
seed.post("/", ...seedRealUserHandler);

export default seed;
