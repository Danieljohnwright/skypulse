import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import jwt from "jsonwebtoken";
import { RowDataPacket, ResultSetHeader } from "mysql2";

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

// GET - fetch user's saved cities
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

// POST - save a searched city
export async function POST(req: Request) {
  const userId = getUser(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { city } = await req.json();
  if (!city)
    return NextResponse.json({ error: "City Required" }, { status: 400 });

  // Avoid duplicates
  const [existing] = await db.execute<RowDataPacket[]>(
    "SELECT id FROM searches WHERE user_id = ? AND city = ?",
    [userId, city],
  );

  if (existing.length === 0) {
    await db.execute("INSERT INTO searches (user_id, city) VALUES (?, ?)", [
      userId,
      city,
    ]);
  }

  return NextResponse.json({ message: "city saved" });
}

// DELETE - remove a saved city (Clean - No "any")
export async function DELETE(req: Request) {
  const userId = getUser(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { city } = await req.json();
  if (!city)
    return NextResponse.json({ error: "City required" }, { status: 400 });

  try {
    const [result] = await db.execute<ResultSetHeader>(
      "DELETE FROM searches WHERE user_id = ? AND city = ?",
      [userId, city],
    );

    if (result.affectedRows > 0) {
      return NextResponse.json({
        success: true,
        message: `${city} removed successfully`,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "City not found or already removed",
        },
        { status: 404 },
      );
    }
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      {
        error: "Failed to delete city",
      },
      { status: 500 },
    );
  }
}
