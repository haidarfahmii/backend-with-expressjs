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
  schedules: Schedule[];
  vehicle: string;
  total_seat: number;
  price: number;
}

export function getRoutes(req: Request, res: Response) {
  try {
    const { from, to } = req.query as { from?: string; to?: string };
    const data = fs.readFileSync("./src/json/routes.json", "utf8");
    let routes: Route[] = JSON.parse(data);

    let filteredRoutes = routes;

    console.log(from, to);

    if (from) {
      filteredRoutes = filteredRoutes.filter(
        (route) => route.departure_city.toLowerCase() === from.toLowerCase()
      );
    }

    if (to) {
      filteredRoutes = filteredRoutes.filter(
        (route) => route.destination_city.toLowerCase() === to.toLowerCase()
      );
    }

    res.status(200).json({
      success: true,
      message: "Routes retrieved successfully",
      data: filteredRoutes,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
    });
  }
}
