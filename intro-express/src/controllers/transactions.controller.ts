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

interface Transaction {
  transaction_id: string;
  uid: string;
  route_id: string;
  booking_date: string;
  departure_time: string;
  total_seat: number;
  total_price: number;
}

export function createBooking(req: Request, res: Response) {
  try {
    const {
      uid,
      route_id,
      booking_date,
      departure_time,
      total_seat,
      total_price,
    } = req.body;

    // baca data route
    const routesData = fs.readFileSync("./src/json/routes.json", "utf8");
    const routes: Route[] = JSON.parse(routesData);

    // baca data transaksi
    const transactionsData = fs.readFileSync(
      "./src/json/transactions.json",
      "utf8"
    );
    const transactions: Transaction[] = JSON.parse(transactionsData);

    const route = routes.find((r) => r.id === route_id);

    if (!route) {
      return res.status(404).json({
        success: false,
        message: "Route not found",
      });
    }

    const schedule = route.schedules.find(
      (s) => s.departure_time === departure_time
    );
    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found",
      });
    }

    const bookingDateTime = new Date(`${booking_date}T${departure_time}:00`);
    const now = new Date();

    if (bookingDateTime <= now) {
      return res.status(400).json({
        success: false,
        message: "Booking date and time must be in the future",
      });
    }

    const bookedSeats = transactions
      .filter(
        (t) =>
          t.route_id === route_id &&
          t.booking_date === booking_date &&
          t.departure_time === departure_time
      )
      .reduce((sum, t) => sum + t.total_seat, 0);

    const availableSeats = route.total_seat - bookedSeats;

    if (total_seat > availableSeats) {
      return res.status(400).json({
        success: false,
        message: "Seats are not available",
      });
    }

    const newTransaction: Transaction = {
      transaction_id: `TRX${Date.now()}`,
      uid,
      route_id,
      booking_date,
      departure_time,
      total_seat,
      total_price: route.price * total_seat,
    };

    transactions.push(newTransaction);
    fs.writeFileSync(
      "./src/json/transactions.json",
      JSON.stringify(transactions, null, 2)
    );

    res.status(201).json({
      success: true,
      message: "Booking successful",
      data: {
        transaction_id: newTransaction.transaction_id,
        total_price: newTransaction.total_price,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || "An unexpected error occurred",
    });
  }
}
