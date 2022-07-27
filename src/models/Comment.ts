import mongoose, { Document, Schema } from "mongoose";
import { IArticle } from "./Article";

export interface IComment {
  text: string;
  article: IArticle;
  creator?: string;
}

export interface ICommentModel extends IComment, Document {}

const CommentSchema: Schema = new Schema(
  {
    text: { type: "String", required: true },
    article: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Article",
      required: true,
    },
    creator: { type: "String" },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model<ICommentModel>("Comment", CommentSchema);
