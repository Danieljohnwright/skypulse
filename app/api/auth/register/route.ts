import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import bcrypt from "bcryptjs";
import { RowDataPacket } from "mysql2";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    // ✅ Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    // ✅ Check if user already exists
    const [existing] = await db.execute<RowDataPacket[]>(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 },
      );
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Insert user
    await db.execute(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword],
    );

    // ✅ Success response
    return NextResponse.json({ message: "User created successfully" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    console.error("REGISTER ERROR:", message);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
