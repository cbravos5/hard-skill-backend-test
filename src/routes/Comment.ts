import { Router } from "express";
import CommentController from "@/controllers/CommentController";
import CommentValidator from "@/validators/Comment";
import CommonValidator from "@/validators/Common";
import { validateErrors } from "@/middlewares/validateErrors";

const commentRouter = Router();

commentRouter.post(
  "/create",
  CommentValidator.validateCommentCreate,
  validateErrors,
  CommentController.createComment
);

commentRouter.get(
  "/get/:id",
  CommentValidator.validateCommentUpdate,
  CommonValidator.validateId,
  validateErrors,
  CommentController.readComment
);

commentRouter.get("/get", validateErrors, CommentController.readAllComment);

commentRouter.patch(
  "/update/:id",
  CommentValidator.validateCommentUpdate,
  CommonValidator.validateId,
  validateErrors,
  CommentController.updateComment
);

commentRouter.delete(
  "/delete/:id",
  CommonValidator.validateId,
  validateErrors,
  CommentController.deleteComment
);

export default commentRouter;
