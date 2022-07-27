import Category, { ICategory } from "@models/Category";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, type }: ICategory = req.body;

    const category = new Category({
      name,
      type,
    });

    await category.save();

    return res.status(StatusCodes.CREATED).json({ category });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};

const readCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Category not found" });

    return res.status(StatusCodes.OK).json({ category });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};

const readAllCategory = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();

    return res.status(StatusCodes.OK).json({ categories });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};

const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Category not found" });

    const { name, type }: ICategory = req.body;

    category.set({
      name: name || category.name,
      type: type || category.type,
    });
    await category.save();

    return res.status(StatusCodes.CREATED).json({ category });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};

const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Category not found" });

    await category.delete();

    return res.status(StatusCodes.OK).json({ message: "Category deleted" });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};

export default {
  createCategory,
  readCategory,
  readAllCategory,
  updateCategory,
  deleteCategory,
};
