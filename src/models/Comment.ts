import mongoose, { Document, Schema } from "mongoose";
import { IAuthor } from "./Author";

export interface IComment {
  text: string;
}

export interface ICommentModel extends IComment, Document {}

const CommentSchema: Schema = new Schema(
  {
    text: { type: "String", required: true },
    creator: { type: "String" },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model<ICommentModel>("Comment", CommentSchema);
