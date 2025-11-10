import express, { Express, Request, Response } from "express";
import expenseRouter from "./router/expense.router";

const app: Express = express();
app.use(express.json());
const port = 8000;

app.get("/", (_: Request, res: Response) => {
  res.status(200).json({
    message: "Express API server",
  });
});

app.use("/api/expenses", expenseRouter);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
