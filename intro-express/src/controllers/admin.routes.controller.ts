import { Request, Response } from "express";
import fs from "fs";

interface Schedule {
  departure_time: string;
  arrival_time: string;
}

interface Route {
  id: string;
  departure_city: string;
  destination_city: string;
  date: string;
  schedules: Schedule[];
  vehicle: string;
  total_seat: number;
  price: number;
}

interface User {
  uid: string;
  username: string;
  email: string;
  password: string;
  role: "USER" | "ADMIN";
}

// Middleware untuk validasi admin
export function validateAdmin(req: Request, res: Response, next: Function) {
  try {
    const { uid } = req.body;

    if (!uid) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: uid is required",
      });
    }

    const usersData = fs.readFileSync("./src/json/users.json", "utf8");
    const users: User[] = JSON.parse(usersData);

    const user = users.find((u) => u.uid === uid);

    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Admin access required",
      });
    }

    next();
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
    });
  }
}

// Create New Route
export function createRoute(req: Request, res: Response) {
  try {
    const {
      departure_city,
      destination_city,
      date,
      schedules,
      vehicle,
      total_seat,
      price,
    } = req.body;

    // Validasi input
    if (
      !departure_city ||
      !destination_city ||
      !date ||
      !schedules ||
      !vehicle ||
      !total_seat ||
      !price
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const routesData = fs.readFileSync("./src/json/routes.json", "utf8");
    const routes: Route[] = JSON.parse(routesData);

    // Generate route ID
    const lastRoute = routes[routes.length - 1];
    const lastId = lastRoute ? parseInt(lastRoute.id.replace("RT", "")) : 0;
    const newId = `RT${String(lastId + 1).padStart(3, "0")}`;

    const newRoute: Route = {
      id: newId,
      departure_city,
      destination_city,
      date,
      schedules,
      vehicle,
      total_seat,
      price,
    };

    routes.push(newRoute);
    fs.writeFileSync("./src/json/routes.json", JSON.stringify(routes, null, 2));

    res.status(201).json({
      success: true,
      message: "Route created successfully",
      data: newRoute,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
    });
  }
}

// Update Existing Route
export function updateRoute(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const {
      departure_city,
      destination_city,
      date,
      schedules,
      vehicle,
      total_seat,
      price,
    } = req.body;

    const routesData = fs.readFileSync("./src/json/routes.json", "utf8");
    const routes: Route[] = JSON.parse(routesData);

    const routeIndex = routes.findIndex((r) => r.id === id);

    if (routeIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Route not found",
      });
    }

    // Update only provided fields
    if (departure_city) routes[routeIndex].departure_city = departure_city;
    if (destination_city)
      routes[routeIndex].destination_city = destination_city;
    if (date) routes[routeIndex].date = date;
    if (schedules) routes[routeIndex].schedules = schedules;
    if (vehicle) routes[routeIndex].vehicle = vehicle;
    if (total_seat) routes[routeIndex].total_seat = total_seat;
    if (price) routes[routeIndex].price = price;

    fs.writeFileSync("./src/json/routes.json", JSON.stringify(routes, null, 2));

    res.status(200).json({
      success: true,
      message: "Route updated successfully",
      data: routes[routeIndex],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
    });
  }
}

// Delete Existing Route
export function deleteRoute(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const routesData = fs.readFileSync("./src/json/routes.json", "utf8");
    const routes: Route[] = JSON.parse(routesData);

    const routeIndex = routes.findIndex((r) => r.id === id);

    if (routeIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Route not found",
      });
    }

    const deletedRoute = routes.splice(routeIndex, 1)[0];

    fs.writeFileSync("./src/json/routes.json", JSON.stringify(routes, null, 2));

    res.status(200).json({
      success: true,
      message: "Route deleted successfully",
      data: deletedRoute,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
    });
  }
}
