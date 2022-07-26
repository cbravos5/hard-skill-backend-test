import { param } from "express-validator";

const validateId = param("id").exists().isMongoId();

export default { validateId };
