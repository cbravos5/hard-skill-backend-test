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

  test("create a Comment with creator and returns it", async () => {
    const commentData = {
      text: "Test comment",
      creator: "Test Creator",
      articleId: article._id,
    };

    const res = await request
      .post("/comments/create")
      .set({ "Content-Type": "application/json" })
      .send(commentData);

    expect(res.body.comment.creator).toEqual(commentData.creator);

    const comment = await Comment.findOne({ id: res.body.comment._id });

    expect(comment).toBeTruthy();
  });

  test("create an anonymous Comment and returns it", async () => {
    const res = await request
      .post("/comments/create")
      .set({ "Content-Type": "application/json" })
      .send({ text: "Test comment", articleId: article._id });

    expect(res.body.comment.creator).toBeFalsy();

    const comment = await Comment.findOne({ id: res.body.comment._id });

    expect(comment).toBeTruthy();
  });

  test("update a Comment and returns it", async () => {
    const oldComment = await Comment.create({
      text: "Test comment",
      article,
    });
    const newText = "Text 2";

    const res = await request
      .patch(`/comments/update/${oldComment._id}`)
      .set({ "Content-Type": "application/json" })
      .send({ text: newText });

    expect(res.body.comment.type).toEqual(newText);

    const comment = await Comment.findOne({ id: oldComment._id });

    expect(comment.text).toEqual(newText);
  });

  test("get a Comment with valid id", async () => {
    const commentData = {
      text: "Test comment",
      article,
    };

    const comment = await Comment.create(commentData);

    const res = await request.get(`/comments/get/${comment._id}`);

    expect(res.body.comment.text).toEqual(commentData.text);
  });

  test("get all Comments", async () => {
    const commentsData = [
      {
        text: "Test comment 1",
        article,
      },
      {
        text: "Test comment 2",
        article,
      },
    ];

    await Comment.insertMany(commentsData);

    const res = await request.get(`/comments/get`);

    expect(res.body.comments.length).toBeGreaterThan(1);
  });

  test("delete a Comment", async () => {
    const comment = await Comment.create({
      text: "Test comment",
      article,
    });

    const res = await request.delete(`/comments/delete/${comment._id}`);

    expect(res.statusCode).toBe(StatusCodes.OK);

    const deleted = await Comment.findById(comment._id);

    expect(deleted).toBeFalsy();
  });

  test("create Comment with invalid params", async () => {
    const res = await request
      .post("/comments/create")
      .set({ "Content-Type": "application/json" })
      .send({
        text: "",
        article,
      });

    expect(res.body.errors).toHaveLength(1);
  });
});
