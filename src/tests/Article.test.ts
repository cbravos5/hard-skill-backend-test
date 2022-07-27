import app from "@/app";
import Article from "@/models/Article";
import Author, { IAuthorModel } from "@/models/Author";
import Category, { ICategoryModel } from "@/models/Category";
import { StatusCodes } from "http-status-codes";
import supertest from "supertest";
import { dbTestFunctions } from "./db";

jest.setTimeout(10000);

const request = supertest(app);

beforeAll(async () => await dbTestFunctions.connect());

afterAll(async () => await dbTestFunctions.closeDatabase());

afterEach(async () => await dbTestFunctions.clearDatabase());

describe("tests that need a created Author and Category", () => {
  let author: IAuthorModel;
  let category: ICategoryModel;

  beforeEach(async () => {
    author = await Author.create({
      firstName: "John",
      lastName: "Doe",
      age: 30,
      email: "john.doe@email.com",
    });

    category = await Category.create({
      name: "Test category",
      type: "Test type",
    });
  });
});
