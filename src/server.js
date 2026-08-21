import app from "./app.js";
import { connectRedis } from "./lib/redis.js";

const PORT = process.env.PORT || 8080;

await connectRedis();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
