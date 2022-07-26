import { body } from "express-validator";

const validateAuthorCreate = [
  body(["firstName", "lastName"])
    .not()
    .isEmpty()
    .isString()
    .isLength({ max: 100 }),
  body("email").isEmail(),
  body("age").isInt(),
];

const validateAuthorUpdate = [
  body(["firstName", "lastName"])
    .optional({ checkFalsy: true })
    .isString()
    .isLength({ max: 100 }),
  body("email").optional({ checkFalsy: true }).isEmail(),
  body("age").optional({ checkFalsy: true }).isInt(),
];

export default { validateAuthorCreate, validateAuthorUpdate };
