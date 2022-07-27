import app from "@/app";
import Article from "@/models/Article";
import Author, { IAuthorModel } from "@/models/Author";
import Category, { ICategoryModel } from "@/models/Category";
import Comment from "@/models/Comment";
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

  test("create an Article with category and returns it", async () => {
    const res = await request
      .post("/articles/create")
      .set({ "Content-Type": "application/json" })
      .send({
        title: "A test title",
        description: "A test description",
        text: "A test text",
        categoryId: category._id,
        authorId: author._id,
      });

    expect(res.body.article.category).toBeTruthy();

    const article = await Article.findOne({ id: res.body.article._id });

    expect(article).toBeTruthy();
  });

  test("create an Article without category and returns it", async () => {
    const res = await request
      .post("/articles/create")
      .set({ "Content-Type": "application/json" })
      .send({
        title: "A test title",
        description: "A test description",
        text: "A test text",
        authorId: author._id,
      });

    expect(res.body.article.category).toBeFalsy();

    const article = await Article.findOne({ id: res.body.article._id });

    expect(article).toBeTruthy();
  });

  test("update an Article's title, description and text and returns it", async () => {
    const oldArticle = await Article.create({
      title: "A test title",
      description: "A test description",
      text: "A test text",
      author,
    });

    const newData = {
      title: "A test title 2",
      description: "A test description 2",
      text: "A test text 2",
    };

    const res = await request
      .patch(`/articles/update/${oldArticle._id}`)
      .set({ "Content-Type": "application/json" })
      .send(newData);

    expect(res.body.article).toMatchObject(newData);

    const article = await Article.findOne({ id: oldArticle._id });

    expect(article).toBeTruthy();
  });

  test("update an Article's author and category and returns it", async () => {
    // category starts null
    const oldArticle = await Article.create({
      title: "A test title",
      description: "A test description",
      text: "A test text",
      author,
    });

    const newAuthor = await Author.create({
      firstName: "Test First Name",
      lastName: "Test Last Name",
      age: 35,
      email: "test@example.com",
    });

    const newData = {
      authorId: newAuthor._id,
      categoryId: category._id,
    };

    await request
      .patch(`/articles/update/${oldArticle._id}`)
      .set({ "Content-Type": "application/json" })
      .send(newData);

    const article = await Article.findOne({ id: oldArticle._id });

    expect(article.category).toEqual(category._id);
  });

  test("get an Article with valid id", async () => {
    const articleData = {
      title: "A test title",
      description: "A test description",
      text: "A test text",
      author,
    };

    const article = await Article.create(articleData);

    const res = await request.get(`/articles/get/${article._id}`);

    expect(res.body.article.text).toEqual(articleData.text);
  });

  test("get all Articles", async () => {
    const articlesData = [
      {
        title: "A test title 1",
        description: "A test description 1",
        text: "A test text 1",
        author,
      },
      {
        title: "A test title 2",
        description: "A test description 2",
        text: "A test text 2",
        author,
      },
    ];

    await Article.insertMany(articlesData);

    const res = await request.get(`/articles/get`);

    expect(res.body.articles.length).toBeGreaterThan(1);
  });

  test("delete an Article", async () => {
    const article = await Article.create({
      title: "A test title",
      description: "A test description",
      text: "A test text",
      author,
      category,
    });

    const res = await request.delete(`/articles/delete/${article._id}`);

    expect(res.statusCode).toBe(StatusCodes.OK);

    const deleted = await Article.findById(article._id);

    expect(deleted).toBeFalsy();
  });

  test("create an Article with non-existing author", async () => {
    const res = await request
      .post("/articles/create")
      .set({ "Content-Type": "application/json" })
      .send({
        title: "A test title",
        description: "A test description",
        text: "A test text",
        authorId: "62e03cbc816b30c6d72883ed",
      });

    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
  });

  test("create an Article with non-existing category", async () => {
    const res = await request
      .post("/articles/create")
      .set({ "Content-Type": "application/json" })
      .send({
        title: "A test title",
        description: "A test description",
        text: "A test text",
        authorId: author._id,
        categoryId: "62e03cbc816b30c6d72883ed",
      });

    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
  });

  test("update an Article with non-existing author", async () => {
    const article = await Article.create({
      title: "A test title",
      description: "A test description",
      text: "A test text",
      author,
    });

    const res = await request
      .patch(`/articles/update/${article._id}`)
      .set({ "Content-Type": "application/json" })
      .send({ authorId: "62e03cbc816b30c6d72883ed" });

    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
  });

  test("update an Article with non-existing category", async () => {
    const article = await Article.create({
      title: "A test title",
      description: "A test description",
      text: "A test text",
      author,
    });

    const res = await request
      .patch(`/articles/update/${article._id}`)
      .set({ "Content-Type": "application/json" })
      .send({ categoryId: "62e03cbc816b30c6d72883ed" });

    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
  });

  test("create an Article with invalid params", async () => {
    const res = await request
      .post("/articles/create")
      .set({ "Content-Type": "application/json" })
      .send({
        title: "",
        description: "A test description",
        text: "A test text",
      });

    expect(res.body.errors).toHaveLength(2);
  });

  test("get an Article with comments and valid id", async () => {
    const article = await Article.create({
      title: "A test title",
      description: "A test description",
      text: "A test text",
      author,
    });

    const comment = await Comment.create({
      text: "Test comment",
      creator: "Test creator",
      article,
    });

    await Article.updateOne(
      { _id: article._id },
      {
        $push: { comments: comment._id },
      }
    );
    const res = await request.get(`/articles/get/${article._id}/comments`);

    expect(res.body.article.comments).toHaveLength(1);
  });

  test("get a non-existing Article with articles", async () => {
    const res = await request.get(
      `/articles/get/62e03cbc816b30c6d72883ed/comments`
    );

    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
  });
});

//  test("get a non-existing Article", async () => {
//    const res = await request.get(`/articles/get/62e03cbc816b30c6d72883ed`);

//    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
//  });

// test("update a non-existing Article", async () => {
//   const res = await request
//     .patch(`/articles/update/62e03cbc816b30c6d72883ed`)
//     .set({ "Content-Type": "application/json" })
//     .send({ email: "email@test.com" });

//   expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
// });

// test("delete a non-existing Article", async () => {
//   const res = await request.delete(`/articles/delete/62e03cbc816b30c6d72883ed`);

//   expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
// });

// test("get an Article with invalid id", async () => {
//   const res = await request.get(`/articles/get/abc`);

//   expect(res.body).toHaveProperty("errors");
// });

// test("get an Article with articles and valid id", async () => {
//   const articleData = {
//     firstName: "John",
//     lastName: "Doe",
//     age: 30,
//     email: "john.doe@email.com",
//   };

//   const article = await Article.create(articleData);

//   const articleData = {
//     title: "A test title",
//     description: "A test description",
//     text: "A test text",
//     article: article,
//   };

//   const article = await Article.create(articleData);

//   await Article.updateOne(
//     { _id: article._id },
//     {
//       $push: { articles: article._id },
//     }
//   );

//   const res = await request.get(`/articles/get/${article._id}/articles`);

//   expect(res.body.article.articles).toHaveLength(1);
// });

// test("get a non-existing Article with articles", async () => {
//   const res = await request.get(
//     `/articles/get/62e03cbc816b30c6d72883ed/articles`
//   );

//   expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
// });
