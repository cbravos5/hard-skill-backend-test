import app from "@/app";
import supertest from "supertest";
import { dbTestFunctions } from "../db";

jest.setTimeout(10000);

const request = supertest(app);

beforeAll(async () => await dbTestFunctions.connect());

it("Creates an Author and returns it", async () => {
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
});

afterAll(async () => {
  await dbTestFunctions.closeDatabase();
});
