import app from "@/app";
import Article from "@/models/Article";
import Author from "@/models/Author";
import { StatusCodes } from "http-status-codes";
import supertest from "supertest";
import { dbTestFunctions } from "./db";

jest.setTimeout(10000);

const request = supertest(app);

beforeAll(async () => await dbTestFunctions.connect());

afterAll(async () => await dbTestFunctions.closeDatabase());

afterEach(async () => await dbTestFunctions.clearDatabase());

test("create an Author and returns it", async () => {
  const authorData = {
    firstName: "John",
    lastName: "Doe",
    age: 30,
    email: "john.doe@email.com",
  };

  const res = await request
    .post("/authors/create")
    .set({ "Content-Type": "application/json" })
    .send(authorData);

  expect(res.body.author.firstName).toEqual(authorData.firstName);

  const author = await Author.findOne({ id: res.body.author._id });

  expect(author).toBeTruthy();
});

test("update an Author and returns it", async () => {
  const authorData = {
    firstName: "John",
    lastName: "Doe",
    age: 30,
    email: "john.doe@email.com",
  };

  const oldAuthor = await Author.create(authorData);
  const newEmail = "john@email.com";

  const res = await request
    .patch(`/authors/update/${oldAuthor._id}`)
    .set({ "Content-Type": "application/json" })
    .send({ email: newEmail });

  expect(res.body.author.email).toEqual(newEmail);

  const author = await Author.findOne({ id: oldAuthor._id });

  expect(author.email).toEqual(newEmail);
});

test("get an Author with valid id", async () => {
  const authorData = {
    firstName: "John",
    lastName: "Doe",
    age: 30,
    email: "john.doe@email.com",
  };

  const author = await Author.create(authorData);

  const res = await request.get(`/authors/get/${author._id}`);

  expect(res.body.author.email).toEqual(authorData.email);
});

test("get all Authors", async () => {
  const authorsData = [
    {
      firstName: "John",
      lastName: "Doe",
      age: 30,
      email: "john.doe@email.com",
    },
    {
      firstName: "Brendan",
      lastName: "Cash",
      age: 25,
      email: "dolor@icloud.org",
    },
  ];

  await Author.insertMany(authorsData);

  const res = await request.get(`/authors/get`);

  expect(res.body.authors.length).toBeGreaterThan(1);
});

test("delete an Author", async () => {
  const authorData = {
    firstName: "John",
    lastName: "Doe",
    age: 30,
    email: "john.doe@email.com",
  };

  const author = await Author.create(authorData);

  const res = await request.delete(`/authors/delete/${author._id}`);

  expect(res.statusCode).toBe(StatusCodes.OK);

  const deleted = await Author.findById(author._id);

  expect(deleted).toBeFalsy();
});

test("create an Author with invalid params", async () => {
  const authorData = {
    firstName: "",
    lastName: "Doe",
    email: "john.doe@email.com",
  };

  const res = await request
    .post("/authors/create")
    .set({ "Content-Type": "application/json" })
    .send(authorData);

  expect(res.body.errors).toHaveLength(2);
});

test("get a non-existing Author", async () => {
  const res = await request.get(`/authors/get/62e03cbc816b30c6d72883ed`);

  expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
});

test("update a non-existing Author", async () => {
  const res = await request
    .patch(`/authors/update/62e03cbc816b30c6d72883ed`)
    .set({ "Content-Type": "application/json" })
    .send({ email: "email@test.com" });

  expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
});

test("delete a non-existing Author", async () => {
  const res = await request.delete(`/authors/delete/62e03cbc816b30c6d72883ed`);

  expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
});

test("get an Author with invalid id", async () => {
  const res = await request.get(`/authors/get/abc`);

  expect(res.body).toHaveProperty("errors");
});

test("get an Author with articles and valid id", async () => {
  const authorData = {
    firstName: "John",
    lastName: "Doe",
    age: 30,
    email: "john.doe@email.com",
  };

  const author = await Author.create(authorData);

  const articleData = {
    title: "A test title",
    description: "A test description",
    text: "A test text",
    author: author,
  };

  const article = await Article.create(articleData);

  await Author.updateOne(
    { _id: author._id },
    {
      $push: { articles: article._id },
    }
  );

  const res = await request.get(`/authors/get/${author._id}/articles`);

  expect(res.body.author.articles).toHaveLength(1);
});

test("get a non-existing Author with articles", async () => {
  const res = await request.get(
    `/authors/get/62e03cbc816b30c6d72883ed/articles`
  );

  expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
});

test("delete an Author with active articles", async () => {
  const author = await Author.create({
    firstName: "John",
    lastName: "Doe",
    age: 30,
    email: "john.doe@email.com",
  });

  const article = await Article.create({
    title: "A test title",
    description: "A test description",
    text: "A test text",
    author,
  });

  await Author.updateOne(
    { _id: author._id },
    {
      $push: { articles: article._id },
    }
  );

  const res = await request.delete(`/authors/delete/${author._id}`);

  expect(res.statusCode).toBe(StatusCodes.CONFLICT);
});
