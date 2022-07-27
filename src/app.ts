import express from "express";
import cors from "cors";
import authorRoutes from "./routes/Author";
import categoryRoutes from "./routes/Category";
import commentRoutes from "./routes/Comment";
import articleRoutes from "./routes/Article";

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
app.use("/comments", commentRoutes);
app.use("/articles", articleRoutes);

export default app;
