import { body } from "express-validator";

const validateCommentCreate = [
  body("text").not().isEmpty().isString().isLength({ max: 280 }),
  body("creator").optional({ checkFalsy: true }).isString(),
];

const validateCommentUpdate = [
  body("text").optional({ checkFalsy: true }).isString().isLength({ max: 280 }),
  body("creator", "param not accepted").not().exists(),
];

export default { validateCommentCreate, validateCommentUpdate };
