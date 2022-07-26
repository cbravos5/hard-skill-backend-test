import { Router } from "express";
import AuthorController from "@/controllers/AuthorController";
import AuthorValidator from "@/validators/Author";
import CommonValidator from "@/validators/Common";
import { validateErrors } from "@/middlewares/validateErrors";

const authorRouter = Router();

authorRouter.post(
  "/create",
  AuthorValidator.validateAuthorCreate,
  validateErrors,
  AuthorController.createAuthor
);

authorRouter.get(
  "/get/:id",
  AuthorValidator.validateAuthorUpdate,
  CommonValidator.validateId,
  validateErrors,
  AuthorController.readAuthor
);

authorRouter.get("/get", validateErrors, AuthorController.readAllAuthor);

authorRouter.patch(
  "/update/:id",
  AuthorValidator.validateAuthorUpdate,
  CommonValidator.validateId,
  validateErrors,
  AuthorController.updateAuthor
);

authorRouter.delete(
  "/delete/:id",
  CommonValidator.validateId,
  validateErrors,
  AuthorController.deleteAuthor
);

export default authorRouter;
