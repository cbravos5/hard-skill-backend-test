import { Router } from "express";
import ArticleController from "@/controllers/ArticleController";
import ArticleValidator from "@/validators/Article";
import CommonValidator from "@/validators/Common";
import { validateErrors } from "@/middlewares/validateErrors";

const articleRouter = Router();

articleRouter.post(
  "/create",
  ArticleValidator.validateArticleCreate,
  validateErrors,
  ArticleController.createArticle
);

articleRouter.get(
  "/get/:id",
  ArticleValidator.validateArticleUpdate,
  CommonValidator.validateId,
  validateErrors,
  ArticleController.readArticle
);

articleRouter.get("/get", validateErrors, ArticleController.readAllArticle);

articleRouter.patch(
  "/update/:id",
  ArticleValidator.validateArticleUpdate,
  CommonValidator.validateId,
  validateErrors,
  ArticleController.updateArticle
);

articleRouter.delete(
  "/delete/:id",
  CommonValidator.validateId,
  validateErrors,
  ArticleController.deleteArticle
);

articleRouter.get(
  "/get/:id/comments",
  CommonValidator.validateId,
  validateErrors,
  ArticleController.readArticleComments
);

export default articleRouter;
