import { Request, Response } from "express";
import fs from "fs";

interface User {
  uid: string;
  username: string;
  email: string;
  password: string;
  role: "USER" | "ADMIN";
}

export function registerUser(req: Request, res: Response) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      throw new Error("Username, email, and password are required.");

    const data = fs.readFileSync("./src/json/users.json", "utf8");
    const users: User[] = JSON.parse(data);

    const newUser: User = {
      uid: String(Date.now()),
      username,
      email,
      password,
      role: "USER",
    };

    users.push(newUser);
    fs.writeFileSync("./src/json/users.json", JSON.stringify(users));

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        uid: newUser.uid,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
    });
  }
}

export function loginUser(req: Request, res: Response) {
  try {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password)
      throw new Error("usernameOrEmail and password are required.");

    const data = fs.readFileSync("./src/json/users.json", "utf8");
    const users: User[] = JSON.parse(data);

    const user = users.find(
      (u) =>
        (u.username === usernameOrEmail || u.email === usernameOrEmail) &&
        u.password === password
    );

    if (!user) throw new Error("Invalid credentials");

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        uid: user.uid,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
    });
  }
}
