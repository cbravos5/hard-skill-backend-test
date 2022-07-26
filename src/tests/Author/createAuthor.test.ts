import app from "@/app";
import Author from "@/models/Author";
import supertest from "supertest";
import { dbTestFunctions } from "../db";

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

test("create Author with invalid params", async () => {
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

test("get an Author with invalid", async () => {
  const res = await request.get(`/authors/get/abc`);

  expect(res.body).toHaveProperty("errors");
});
