import express from "express";
import cors from "cors";

const app = express();

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.get("/", (_req, res) => {
  res.send("Healthy");
});

export default app;
