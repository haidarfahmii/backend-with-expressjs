import { Router } from "express";
import {
  createRoute,
  updateRoute,
  deleteRoute,
  validateAdmin,
} from "../controllers/admin.routes.controller";

const router = Router();

// Semua endpoint admin harus melalui validasi admin
router.post("/", validateAdmin, createRoute);
router.put("/:id", validateAdmin, updateRoute);
router.delete("/:id", validateAdmin, deleteRoute);

export default router;
