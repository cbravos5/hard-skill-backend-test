import mongoose, { Document, Schema } from "mongoose";
import { IArticle } from "./Article";

export interface IAuthor {
  firstName: string;
  lastName: String;
  age: number;
  email: string;
  articles?: IArticle[];
}

export interface IAuthorModel extends IAuthor, Document {}

const AuthorSchema: Schema = new Schema(
  {
    firstName: { type: "String", required: true },
    lastName: { type: "String", required: true },
    age: { type: "Number", required: true },
    email: { type: "String", required: true },
    articles: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Article" }],
  },
  {
    versionKey: false,
  }
);

export default mongoose.model<IAuthorModel>("Author", AuthorSchema);
