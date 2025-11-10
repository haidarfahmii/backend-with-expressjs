import { Router } from "express";
import { createBooking } from "../controllers/transactions.controller";

const router = Router();

router.post("/", createBooking);

export default router;
