import mongoose from "mongoose";
import app from "./app";
import { APP_PORT, DB } from "@/configs/config";

const dbURI = `mongodb+srv://${DB.USER}:${DB.PASSWORD}@cluster0.nlxbj.mongodb.net/?retryWrites=true&w=majority`;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true,
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
};

console.log("connecting to database...");

mongoose
  .connect(dbURI, options)
  .then(() => {
    console.log("Mongoose connection done");
    app.listen(APP_PORT, () => {
      console.log(`server listening on ${APP_PORT}`);
    });
  })
  .catch((e) => {
    console.log("Mongoose connection error");
    console.log(e);
  });

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on("connected", () => {
  console.debug("Mongoose default connection open to " + dbURI);
});

// If the connection throws an error
mongoose.connection.on("error", (err) => {
  console.log("Mongoose default connection error: " + err);
});

// When the connection is disconnected
mongoose.connection.on("disconnected", () => {
  console.log("Mongoose default connection disconnected");
});

// If the Node process ends, close the Mongoose connection (ctrl + c)
process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    console.log(
      "Mongoose default connection disconnected through app termination"
    );
    process.exit(0);
  });
});

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception: " + err);
});
