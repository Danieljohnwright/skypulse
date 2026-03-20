import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city");

  if (!city) {
    return NextResponse.json({ error: "City required" }, { status: 400 });
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "Missing API key" }, { status: 500 });
  }

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`,
    );

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.message }, { status: 400 });
    }

    return NextResponse.json({
      city: data.name,
      temperature: data.main.temp,
      description: data.weather[0].description,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch weather" },
      { status: 500 },
    );
  }
}
