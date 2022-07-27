import Author, { IAuthor } from "@models/Author";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const createAuthor = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, age, email }: IAuthor = req.body;

    const author = new Author({
      firstName,
      lastName,
      age,
      email,
    });

    await author.save();

    return res.status(StatusCodes.CREATED).json({ author });
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};

const readAuthor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const author = await Author.findById(id);

    if (!author)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Author not found" });

    return res.status(StatusCodes.OK).json({ author });
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};

const readAllAuthor = async (req: Request, res: Response) => {
  try {
    const authors = await Author.find();

    return res.status(StatusCodes.OK).json({ authors });
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};

const updateAuthor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const author = await Author.findById(id);

    if (!author)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Author not found" });

    const { firstName, lastName, age, email }: IAuthor = req.body;

    author.set({
      firstName: firstName || author.firstName,
      lastName: lastName || author.lastName,
      age: age || author.age,
      email: email || author.email,
    });
    await author.save();

    return res.status(StatusCodes.CREATED).json({ author });
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};

const deleteAuthor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const author = await Author.findById(id);

    if (!author)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Author not found" });

    if (author.articles.length > 0)
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: "Author has active articles" });

    await author.delete();

    return res.status(StatusCodes.OK).json({ message: "Author deleted" });
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};

const readAuthorArticles = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const author = await Author.findById(id).populate("articles");

    if (!author)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Author not found" });

    return res.status(StatusCodes.OK).json({ author });
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};

export default {
  createAuthor,
  readAuthor,
  readAllAuthor,
  updateAuthor,
  deleteAuthor,
  readAuthorArticles,
};
