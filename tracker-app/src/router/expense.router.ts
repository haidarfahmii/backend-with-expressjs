import { Router } from "express";
import {
  getAllExpenses,
  getExpensesById,
} from "../controllers/expense.controller";

const router = Router();

router.get("/", getAllExpenses);
router.get("/:id", getExpensesById);

export default router;
