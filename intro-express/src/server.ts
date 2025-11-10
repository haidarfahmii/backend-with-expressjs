import express, { Express, Request, Response } from "express";
import productsRouter from "./routers/products.router";
import usersRouter from "./routers/users.router";
import routesRouter from "./routers/routes.router";
import transactionsRouter from "./routers/transactions.router";

const app: Express = express();
app.use(express.json());
const port = 5000;

app.get("/", (_: Request, res: Response) => {
  res.status(200).json({
    message: "Express API server",
  });
});

app.use("/api/products", productsRouter);
app.use("/api/auth", usersRouter);
app.use("/api/routes-travel", routesRouter);
app.use("/api/transactions", transactionsRouter);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
