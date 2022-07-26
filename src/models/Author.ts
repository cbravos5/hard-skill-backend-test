import mongoose, { Document, Schema } from "mongoose";

export interface IAuthor {
  firstName: string;
  lastName: String;
  age: number;
  email: string;
}

export interface IAuthorModel extends IAuthor, Document {}

const AuthorSchema: Schema = new Schema(
  {
    firstName: { type: "String", required: true },
    lastName: { type: "String", required: true },
    age: { type: "Number", required: true },
    email: { type: "String", required: true },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model<IAuthorModel>("Author", AuthorSchema);
