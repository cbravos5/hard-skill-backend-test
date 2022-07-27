import { body } from "express-validator";

const validateArticleCreate = [
  body(["title", "text", "description"]).not().isEmpty().isString(),
  body("authorId").isMongoId(),
  body("categoryId").optional({ checkFalsy: true }).isMongoId(),
];

const validateArticleUpdate = [
  body(["title", "text", "description"])
    .optional({ checkFalsy: true })
    .isString(),
  body("authorId").optional({ checkFalsy: true }).isMongoId(),
  body("categoryId").optional({ checkFalsy: true }).isMongoId(),
];

export default { validateArticleCreate, validateArticleUpdate };
