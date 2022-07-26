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
