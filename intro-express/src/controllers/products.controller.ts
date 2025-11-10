import { Request, Response } from "express";
import fs from "fs";

export function getProductsController(req: Request, res: Response) {
  try {
    const data = fs.readFileSync("./src/json/products.json", "utf8");
    const products = JSON.parse(data);

    console.log(products);

    res.status(200).json({
      success: true,
      message: "Get Products successfully",
      data: products,
    });
  } catch (error) {
    console.log(error);
  }
}

export function postProductsController(req: Request, res: Response) {
  try {
    const { name, price } = req.body;

    if (!name || !price) throw new Error("Name or price is required");

    // Step-01 : read current product untuk ambil data lama
    const data = fs.readFileSync("./src/json/products.json", "utf8");
    const products = JSON.parse(data);

    const newId = products[products.length - 1]?.id + 1;
    products?.push({ id: newId, name, price });

    fs.writeFileSync("./src/json/products.json", JSON.stringify(products));

    res.status(201).json({
      success: true,
      message: "Create Product successfully",
      data: {
        name,
        price,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
    });
  }
}

export function deleteProductsController(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const data = fs.readFileSync("./src/json/products.json", "utf8");
    const products = JSON.parse(data);
    const newProducts = products.filter(
      (product: any) => product.id !== parseInt(id)
    );

    fs.writeFileSync("./src/json/products.json", JSON.stringify(newProducts));

    res.status(200).json({
      success: true,
      message: "Delete Product successfully",
      data: newProducts,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
    });
  }
}

export function updateProductsController(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, price } = req.body;

    if (!name && !price) {
      return res.status(400).json({
        success: false,
        message: "Name and price are required for update",
      });
    }

    const data = fs.readFileSync("./src/json/products.json", "utf8");
    const products = JSON.parse(data);

    const productIndex = products.findIndex((product: any) => product.id == id);

    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    products[productIndex] = { ...products[productIndex], name, price };

    fs.writeFileSync("./src/json/products.json", JSON.stringify(products));

    res.status(200).json({
      success: true,
      message: "Update Product successfully",
      data: products[productIndex],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
    });
  }
}
