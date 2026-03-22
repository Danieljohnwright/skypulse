import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import bcrypt from "bcryptjs";
import { RowDataPacket } from "mysql2";
import jwt from "jsonwebtoken";

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}
export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // check if user exists

    const [rows] = await db.execute<(User & RowDataPacket)[]>(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );

    const user = rows[0];

    if (!user) {
      return NextResponse.json(
        { error: "User not registered" },
        { status: 404 },
      );
    }

    // check password

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Incorrect Password or Username" },
        { status: 401 },
      );
    }
    //  create token
    const token = jwt.sign(
      {
        id: user,
        email: user.email,
      },
      "SECRET_KEY",
      {
        expiresIn: "1d",
      },
    );
    return NextResponse.json({ token });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknowwn Error";
    console.log("LOGIN ERROR:", message);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
