import express from "express";
import cors from "cors";

// import testRoute from "./routes/testRoute.js";
import authRoute from "./routes/authRoute.js";

const app = express();

app.use(express.urlencoded());
app.use(express.json());
app.use(cors());

// app.use("/api", testRoute);
app.use("/api", authRoute);

export default app;
