import { Hono } from "hono";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import authRoutes from "./routes/auth";

const app = new Hono();

app.use(logger());
app.use(prettyJSON());

app.notFound((c) => c.json({ message: "Not Found", success: false }, 404));

app.get("/", (c) => {
    return c.text("Hello Hono!");
});

app.route("/auth", authRoutes);

export default app;
