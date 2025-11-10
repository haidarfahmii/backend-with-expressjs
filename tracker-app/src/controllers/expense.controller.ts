import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { Expense } from "../dto/expense.dto";

const dbPath = path.resolve(__dirname, "../json/expense.json");

const readDB = (): Expense[] => {
  const data = fs.readFileSync(dbPath, "utf8");
  return JSON.parse(data) as Expense[];
};

const writeDB = (data: Expense[]): void => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

export function getAllExpenses(req: Request, res: Response) {
  try {
    const expenses = readDB();

    res.status(200).json({
      success: true,
      message: "Get expenses successfully",
      data: expenses,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
    });
  }
}

export function getExpensesById(req: Request, res: Response) {
  try {
    const expenses = readDB();

    const idToFind = parseInt(req.params.id, 10);

    const expense = expenses.find((e: any) => e.id === idToFind);

    if (!expense) throw new Error("Expense not found");

    res.status(200).json({
      success: true,
      message: "Expense found",
      data: expense,
    });
  } catch (error) {}
}
