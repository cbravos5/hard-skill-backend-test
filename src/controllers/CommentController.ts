import Article from "@/models/Article";
import Comment from "@models/Comment";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const createComment = async (req: Request, res: Response) => {
  try {
    const { text, creator, articleId } = req.body;

    const article = await Article.findById(articleId);

    if (!article)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Article not found" });

    const comment = new Comment({
      text,
      article,
      creator: creator || null,
    });

    await comment.save();

    await Article.updateOne(
      { _id: article._id },
      {
        $push: { comments: comment._id },
      }
    );

    return res.status(StatusCodes.CREATED).json({ comment });
  } catch (error) {
    console.log(error);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};

const readComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id).populate("article");

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
    const comments = await Comment.find().populate("article");

    return res.status(StatusCodes.OK).json({ comments });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};

const updateComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);

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

    await Article.updateOne(
      { _id: comment.article },
      {
        $pull: { comments: comment._id },
      }
    );

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
