import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import jwt from "jsonwebtoken";
import { RowDataPacket } from "mysql2";

const getUser = (req: Request) => {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: { id: number };
    };
    return decoded.id.id;
  } catch {
    return null;
  }
};

// GET (fetch users saved info)

export async function GET(req: Request) {
  const userId = getUser(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT city FROM searches WHERE user_id = ? ORDER BY created_at ASC",
    [userId],
  );
  return NextResponse.json({ cities: rows.map((r) => r.city) });
}

// post (save searched city)

export async function POST(req: Request) {
  const userId = getUser(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { city } = await req.json();
  if (!city)
    return NextResponse.json({ error: "City Required" }, { status: 400 });
  // avoiid duplicates

  const [existing] = await db.execute<RowDataPacket[]>(
    "SELECT id FROM searches WHERE user_id = ? AND city = ?",
    [userId, city],
  );
  if ((existing as RowDataPacket[]).length === 0) {
    await db.execute("INSERT INTO searches (user_id, city) VALUES (?, ?)", [
      userId,
      city,
    ]);
  }
  return NextResponse.json({ message: "city saved" });
}
