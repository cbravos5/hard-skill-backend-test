import { body } from "express-validator";

const validateCommentCreate = [
  body("text").not().isEmpty().isString().isLength({ max: 280 }),
  body("articleId").isMongoId(),
  body("creator").optional({ checkFalsy: true }).isString(),
];

const validateCommentUpdate = [
  body("text").optional({ checkFalsy: true }).isString().isLength({ max: 280 }),
];

export default { validateCommentCreate, validateCommentUpdate };
