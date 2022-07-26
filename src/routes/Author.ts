import { Router } from "express";
import AuthorController from "@/controllers/AuthorController";

const authorRouter = Router();

authorRouter.post("/create", AuthorController.createAuthor);
authorRouter.get("/get/:id", AuthorController.readAuthor);
authorRouter.get("/get", AuthorController.readAllAuthor);
authorRouter.patch("/update/:id", AuthorController.updateAuthor);
authorRouter.delete("/delete/:id", AuthorController.deleteAuthor);

export default authorRouter;
