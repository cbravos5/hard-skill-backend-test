import mongoose from "mongoose";
import app from "../app";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Server } from "http";

const dbTest = new MongoMemoryServer();
let server: Server;

const connect = async () => {
  await dbTest.start();
  const dbURI = dbTest.getUri();

  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  };

  await mongoose.connect(dbURI, options);

  server = app.listen(3000);
};

const closeDatabase = async () => {
  server.close();
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await dbTest.stop();
};

const clearDatabase = async () => {
  try {
    const collections = mongoose.connection.collections;
    for (const key in collections) await collections[key].drop();
  } catch (error) {}
};

export const dbTestFunctions = { connect, closeDatabase, clearDatabase };
