import { body } from "express-validator";

const validateCategoryCreate = [
  body(["name", "type"]).not().isEmpty().isString().isLength({ max: 100 }),
];

const validateCategoryUpdate = [
  body(["name", "type"])
    .optional({ checkFalsy: true })
    .isString()
    .isLength({ max: 100 }),
];

export default { validateCategoryCreate, validateCategoryUpdate };
