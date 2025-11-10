/**
 * Router:
 * 1. Handle Routing
 */
import { Router } from "express";
import {
  deleteProductsController,
  getProductsController,
  postProductsController,
  updateProductsController,
} from "../controllers/products.controller";

const router = Router();

router.get("/", getProductsController);
router.post("/", postProductsController);
router.delete("/:id", deleteProductsController);
router.put("/:id", updateProductsController);

export default router;
