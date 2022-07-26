import Author, { IAuthor } from "@models/Author";
import { Request, Response } from "express";

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

    return res.status(201).json({ author });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const readAuthor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const author = await Author.findById(id);

    if (!author) return res.status(404).json({ message: "Author not found" });

    return res.status(200).json({ author });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const readAllAuthor = async (req: Request, res: Response) => {
  try {
    const authors = await Author.find();

    return res.status(200).json({ authors });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const updateAuthor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const author = await Author.findById(id);

    if (!author) return res.status(404).json({ message: "Author not found" });

    const data: IAuthor = req.body;

    author.set(data);
    await author.save();

    return res.status(201).json({ author });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const deleteAuthor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const author = await Author.findById(id);

    if (!author) return res.status(404).json({ message: "Author not found" });

    await author.delete();

    return res.status(200).json({ message: "Author deleted" });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export default {
  createAuthor,
  readAuthor,
  readAllAuthor,
  updateAuthor,
  deleteAuthor,
};
