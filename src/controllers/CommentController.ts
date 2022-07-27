import Author from "@/models/Author";
import Comment, { IComment } from "@models/Comment";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const createComment = async (req: Request, res: Response) => {
  try {
    const { text, authorId } = req.body;

    const author = authorId ? await Author.findOne({ id: authorId }) : null;

    if (authorId && !author)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Author not found" });

    const comment = new Comment({
      text,
      author: author || null,
    });

    await comment.save();

    return res.status(StatusCodes.CREATED).json({ comment });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};

const readComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id).populate("author");

    if (!comment)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Comment not found" });

    return res.status(StatusCodes.OK).json({ comment });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};

const readAllComment = async (req: Request, res: Response) => {
  try {
    const categories = await Comment.find().populate("author");

    return res.status(StatusCodes.OK).json({ categories });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};

const updateComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id).populate("author");
    console.log("salve");

    if (!comment)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Comment not found" });

    const { text } = req.body;

    comment.set({
      text: text || comment.text,
    });

    await comment.save();

    return res.status(StatusCodes.CREATED).json({ comment });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};

const deleteComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (!comment)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Comment not found" });

    await comment.delete();

    return res.status(StatusCodes.OK).json({ message: "Comment deleted" });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};

export default {
  createComment,
  readComment,
  readAllComment,
  updateComment,
  deleteComment,
};
