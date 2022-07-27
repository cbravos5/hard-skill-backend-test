import mongoose, { Document, Schema } from "mongoose";
import { IAuthor } from "./Author";
import { ICategory } from "./Category";
import { IComment } from "./Comment";

export interface IArticle {
  title: string;
  description: string;
  text: string;
  author: IAuthor;
  category?: ICategory;
  comments?: IComment[];
}

export interface IArticleModel extends IArticle, Document {}

const ArticleSchema: Schema = new Schema(
  {
    title: { type: "String", required: true },
    description: { type: "String", required: true },
    text: { type: "String", required: true },
    author: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Author",
      required: true,
    },
    category: { type: mongoose.SchemaTypes.ObjectId, ref: "Category" },
    comments: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Comment" }],
  },
  {
    versionKey: false,
  }
);

export default mongoose.model<IArticleModel>("Article", ArticleSchema);
