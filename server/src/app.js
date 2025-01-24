import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { config } from "dotenv";

config({
  path: "./.env"
});

const app = express();

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(morgan('dev'));
app.use(cookieParser())

app.get('/', (_, res) => {
  res.json({ message: 'Hello World' });
});

// Routes
import userRoutes from './routes/user.routes.js';
import blogRoutes from "./routes/blog.routes.js";
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/blog", blogRoutes);

export { app };