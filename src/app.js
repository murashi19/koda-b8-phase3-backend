import express from "express";

// import testRoute from "./routes/testRoute.js";
import authRoute from "./routes/authRoute.js";
import linkRoute from "./routes/linkRoute.js";
import corsMiddleware from "./middlewares/cors.js";

const app = express();

app.use(express.urlencoded());
app.use(express.json());
app.use(corsMiddleware);

// app.use("/api", testRoute);
app.use("/api", authRoute);
app.use("/api", linkRoute);

export default app;
