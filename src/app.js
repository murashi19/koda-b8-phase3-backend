import express from "express";
import swaggerUi from "swagger-ui-express";

// import testRoute from "./routes/testRoute.js";
import authRoute from "./routes/authRoute.js";
import linkRoute from "./routes/linkRoute.js";
import redirectRoute from "./routes/redirectRoute.js";
import corsMiddleware from "./middlewares/cors.js";
import swaggerSpec from "./config/swagger.js";

const app = express();

app.use(express.urlencoded());
app.use(express.json());
app.use(corsMiddleware);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// app.use("/api", testRoute);
app.use("/api", authRoute);
app.use("/api", linkRoute);
app.use("/", redirectRoute);

export default app;
