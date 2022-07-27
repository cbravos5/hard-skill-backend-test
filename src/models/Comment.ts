import mongoose, { Document, Schema } from "mongoose";
import { IAuthor } from "./Author";

export interface IComment {
  text: string;
  author?: IAuthor;
}

export interface ICommentModel extends IComment, Document {}

const CommentSchema: Schema = new Schema(
  {
    text: { type: "String", required: true },
    author: { type: mongoose.SchemaTypes.ObjectId, ref: "Author" },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model<ICommentModel>("Comment", CommentSchema);
