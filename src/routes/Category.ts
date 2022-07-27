import { Router } from "express";
import CategoryController from "@/controllers/CategoryController";
import CategoryValidator from "@/validators/Category";
import CommonValidator from "@/validators/Common";
import { validateErrors } from "@/middlewares/validateErrors";

const categoryRouter = Router();

categoryRouter.post(
  "/create",
  CategoryValidator.validateCategoryCreate,
  validateErrors,
  CategoryController.createCategory
);

categoryRouter.get(
  "/get/:id",
  CategoryValidator.validateCategoryUpdate,
  CommonValidator.validateId,
  validateErrors,
  CategoryController.readCategory
);

categoryRouter.get("/get", validateErrors, CategoryController.readAllCategory);

categoryRouter.patch(
  "/update/:id",
  CategoryValidator.validateCategoryUpdate,
  CommonValidator.validateId,
  validateErrors,
  CategoryController.updateCategory
);

categoryRouter.delete(
  "/delete/:id",
  CommonValidator.validateId,
  validateErrors,
  CategoryController.deleteCategory
);

categoryRouter.get(
  "/get/:id/articles",
  CommonValidator.validateId,
  validateErrors,
  CategoryController.readCategoryArticles
);

export default categoryRouter;
