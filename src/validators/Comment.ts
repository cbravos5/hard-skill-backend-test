import { body } from "express-validator";

const validateCommentCreate = [
  body("text").not().isEmpty().isString().isLength({ max: 280 }),
  body("authorId").optional({ checkFalsy: true }).isMongoId(),
];

const validateCommentUpdate = [
  body("text").optional({ checkFalsy: true }).isString().isLength({ max: 280 }),
  body("authorId").optional({ checkFalsy: true }).isMongoId(),
];

export default { validateCommentCreate, validateCommentUpdate };
