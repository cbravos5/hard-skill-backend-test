import mongoose, { Document, Schema } from "mongoose";
import { IArticle } from "./Article";

export interface ICategory {
  name: string;
  type: string;
  articles?: IArticle[];
}

export interface ICategoryModel extends ICategory, Document {}

const CategorySchema: Schema = new Schema(
  {
    name: { type: "String", required: true },
    type: { type: "String", required: true },
    articles: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Article" }],
  },
  {
    versionKey: false,
  }
);

export default mongoose.model<ICategoryModel>("Category", CategorySchema);
