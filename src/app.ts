import express from "express";
import cors from "cors";
import authorRoutes from "./routes/Author";
import categoryRoutes from "./routes/Category";

const app = express();

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// Health check
app.get("/ping", (_req, res) => res.status(200).send({ message: "Healthy" }));

// Routes
app.use("/authors", authorRoutes);
app.use("/categories", categoryRoutes);

export default app;
