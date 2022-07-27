import app from "@/app";
import Article, { IArticleModel } from "@/models/Article";
import Author from "@/models/Author";
import Comment from "@/models/Comment";
import { StatusCodes } from "http-status-codes";
import supertest from "supertest";
import { dbTestFunctions } from "./db";

jest.setTimeout(10000);

const request = supertest(app);

beforeAll(async () => await dbTestFunctions.connect());

afterAll(async () => await dbTestFunctions.closeDatabase());

afterEach(async () => await dbTestFunctions.clearDatabase());

describe("tests that need a created Article", () => {
  let article: IArticleModel;

  beforeEach(async () => {
    const author = await Author.create({
      firstName: "John",
      lastName: "Doe",
      age: 30,
      email: "john.doe@email.com",
    });

    article = await Article.create({
      title: "A test title",
      description: "A test description",
      text: "A test text",
      author: author,
    });
  });

  test("create an Comment and returns it", async () => {
    const commentData = {
      text: "Test comment",
      article: "Test type",
      articleId: article._id,
    };

    const res = await request
      .post("/comments/create")
      .set({ "Content-Type": "application/json" })
      .send(commentData);

    expect(res.body.comment.text).toEqual(commentData.text);

    const comment = await Comment.findOne({ id: res.body.comment._id });

    expect(comment).toBeTruthy();
  });
});
