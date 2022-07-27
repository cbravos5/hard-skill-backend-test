import Author from "@/models/Author";
import Category from "@/models/Category";
import Article, { IArticle } from "@models/Article";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const createArticle = async (req: Request, res: Response) => {
  try {
    const { title, description, text, authorId, categoryId } = req.body;

    const author = await Author.findById(authorId);

    if (!author)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Author not found" });

    const category = categoryId ? await Category.findById(categoryId) : null;

    if (categoryId && !category)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Category not found" });

    const article = new Article({
      title,
      description,
      text,
      author,
      category,
    });

    await article.save();

    author.articles.push(article);

    await author.save();

    if (category) {
      category.articles.push(article);
      await category.save();
    }

    return res.status(StatusCodes.CREATED).json({ article });
  } catch (error) {
    console.log(error);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};

const readArticle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const article = await Article.findById(id).populate(["author", "category"]);

    if (!article)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Article not found" });

    return res.status(StatusCodes.OK).json({ article });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};

const readAllArticle = async (req: Request, res: Response) => {
  try {
    const articles = await Article.find().populate(["author", "category"]);

    return res.status(StatusCodes.OK).json({ articles });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};

const updateArticle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const article = await Article.findById(id);

    if (!article)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Article not found" });

    const { title, description, text, authorId, categoryId } = req.body;

    const author = authorId ? await Author.findById(authorId) : null;

    // if author is updating then checks if found one
    if (authorId && !author)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Author not found" });

    const category = categoryId ? await Category.findById(categoryId) : null;

    // if category is updating then checks if found one
    if (categoryId && !category)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Category not found" });

    // remove from actual author and add to new author
    if (author) {
      await Author.updateOne(
        { _id: article.author },
        {
          $pull: { articles: article._id },
        }
      );
      author.articles.push(article);
      await author.save();
    }

    // remove from actual category and add to new category
    if (category) {
      await Category.updateOne(
        { _id: article.category },
        {
          $pull: { articles: article._id },
        }
      );
      category.articles.push(article);
      await category.save();
    }

    article.set({
      title: title || article.title,
      description: description || article.description,
      text: text || article.text,
      author: author || article.author,
      category: category || article.category,
    });

    await article.save();

    return res.status(StatusCodes.CREATED).json({ article });
  } catch (error) {
    console.log(error);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};

const deleteArticle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const article = await Article.findById(id);

    if (!article)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Article not found" });

    await Author.updateOne(
      { _id: article.author },
      {
        $pull: { articles: article._id },
      }
    );

    if (article.category)
      await Category.updateOne(
        { _id: article.category },
        {
          $pull: { articles: article._id },
        }
      );

    await article.delete();

    return res.status(StatusCodes.OK).json({ message: "Article deleted" });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};

const readArticleComments = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const article = await Article.findById(id).populate(["comments"]);

    if (!article)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Article not found" });

    return res.status(StatusCodes.OK).json({ article });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};

export default {
  createArticle,
  readArticle,
  readAllArticle,
  updateArticle,
  deleteArticle,
  readArticleComments,
};
