import app from "@/app";
import Article from "@/models/Article";
import Author from "@/models/Author";
import Category from "@/models/Category";
import { StatusCodes } from "http-status-codes";
import supertest from "supertest";
import { dbTestFunctions } from "./db";

jest.setTimeout(10000);

const request = supertest(app);

beforeAll(async () => await dbTestFunctions.connect());

afterAll(async () => await dbTestFunctions.closeDatabase());

afterEach(async () => await dbTestFunctions.clearDatabase());

test("create a Category and returns it", async () => {
  const categoryData = {
    name: "Test category",
    type: "Test type",
  };

  const res = await request
    .post("/categories/create")
    .set({ "Content-Type": "application/json" })
    .send(categoryData);

  expect(res.body.category.name).toEqual(categoryData.name);

  const category = await Category.findOne({ id: res.body.category._id });

  expect(category).toBeTruthy();
});

test("update a Category and returns it", async () => {
  const categoryData = {
    name: "Test category",
    type: "Test type",
  };

  const oldCategory = await Category.create(categoryData);
  const newType = "Test type 2";

  const res = await request
    .patch(`/categories/update/${oldCategory._id}`)
    .set({ "Content-Type": "application/json" })
    .send({ type: newType });

  expect(res.body.category.type).toEqual(newType);

  const category = await Category.findOne({ id: oldCategory._id });

  expect(category.type).toEqual(newType);
});

test("get a Category with valid id", async () => {
  const categoryData = {
    name: "Test category",
    type: "Test type",
  };

  const category = await Category.create(categoryData);

  const res = await request.get(`/categories/get/${category._id}`);

  expect(res.body.category.type).toEqual(categoryData.type);
});

test("get all Categories", async () => {
  const categoriesData = [
    {
      name: "Test category 1",
      type: "Test type 1",
    },
    {
      name: "Test category 2",
      type: "Test type 2",
    },
  ];

  await Category.insertMany(categoriesData);

  const res = await request.get(`/categories/get`);

  expect(res.body.categories.length).toBeGreaterThan(1);
});

test("delete a Category", async () => {
  const categoryData = {
    name: "Test category",
    type: "Test type",
  };

  const category = await Category.create(categoryData);

  const res = await request.delete(`/categories/delete/${category._id}`);

  expect(res.statusCode).toBe(StatusCodes.OK);

  const deleted = await Category.findById(category._id);

  expect(deleted).toBeFalsy();
});

test("create a Category with invalid params", async () => {
  const categoryData = {
    name: "",
    type: "Test type",
  };

  const res = await request
    .post("/categories/create")
    .set({ "Content-Type": "application/json" })
    .send(categoryData);

  expect(res.body.errors).toHaveLength(1);
});

test("get a non-existing Category", async () => {
  const res = await request.get(`/categories/get/62e03cbc816b30c6d72883ed`);

  expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
});

test("update a non-existing Category", async () => {
  const res = await request
    .patch(`/categories/update/62e03cbc816b30c6d72883ed`)
    .set({ "Content-Type": "application/json" })
    .send({ type: "Test type" });

  expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
});

test("delete a non-existing Category", async () => {
  const res = await request.delete(
    `/categories/delete/62e03cbc816b30c6d72883ed`
  );

  expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
});

test("get a Category with invalid id", async () => {
  const res = await request.get(`/categories/get/abc`);

  expect(res.body).toHaveProperty("errors");
});

test("get a Category with articles and valid id", async () => {
  const categoryData = {
    name: "Test category",
    type: "Test type",
  };

  const category = await Category.create(categoryData);

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
    category: category,
    author: author,
  };

  const article = await Article.create(articleData);

  await Category.updateOne(
    { _id: category._id },
    {
      $push: { articles: article._id },
    }
  );

  const res = await request.get(`/categories/get/${category._id}/articles`);

  expect(res.body.category.articles).toHaveLength(1);
});

test("get a non-existing Category with articles", async () => {
  const res = await request.get(
    `/categories/get/62e03cbc816b30c6d72883ed/articles`
  );

  expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
});
