import app from "@/app";
import { StatusCodes } from "http-status-codes";
import supertest from "supertest";
import { dbTestFunctions } from "./db";
import { Server } from "http";

jest.setTimeout(10000);

let request: supertest.SuperTest<supertest.Test>;
let server: Server;

beforeAll(() => {
  server = app.listen(3000);
  request = supertest(app);
});

afterAll(() => server.close());

test("get a healthy message", async () => {
  const res = await request.get(`/ping`);

  expect(res.statusCode).toBe(StatusCodes.OK);
});
