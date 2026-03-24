"use client";

import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import WeatherCard from "../Components/WeatherCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Weather {
  city: string;
  temperature: number;
  description: string;
}

export default function Dashboard() {
  const [weatherReports, setWeatherReports] = useState<Weather[]>([]);
  const [recommendations, setRecommendations] = useState<Weather[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState("");
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const userRes = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        const userData = await userRes.json();
        setUserName(userData.name);
      } catch (err) {
        console.error("Could not fetch user:", err);
      }

      try {
        const cities = ["Johannesburg", "Durban", "Tokyo"];
        const results = await Promise.all(
          cities.map(async (city) => {
            const res = await fetch(`/api/weather?city=${city}`);
            try {
              const data = await res.json();
              return data;
            } catch (err) {
              console.error("JSON parse error:", err);
              return null;
            }
          }),
        );

        const validResults = results.filter((r): r is Weather => r !== null);
        setWeatherReports(validResults);

        const sunny = validResults.filter(
          (city) =>
            city.temperature >= 25 &&
            city.description.toLowerCase().includes("clear"),
        );
        setRecommendations(sunny);
      } catch (error) {
        console.error("Fetch error:", error);
      }

      try {
        const savedRes = await fetch("/api/searches", {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        const savedData = await savedRes.json();

        if (savedData.cities && savedData.cities.length > 0) {
          const results = await Promise.all(
            savedData.cities.map(async (city: string) => {
              const res = await fetch(`/api/weather?city=${city}`);
              if (!res.ok) return null;
              return res.json();
            }),
          );
          const valid = results.filter((r): r is Weather => r !== null);
          setWeatherReports((prev) => {
            const existingCities = prev.map((w) => w.city);
            return [
              ...prev,
              ...valid.filter((w) => !existingCities.includes(w.city)),
            ];
          });
        }
      } catch (err) {
        console.error("Could not load saved cities:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const handleAddCity = async (e: React.FormEvent) => {
    e.preventDefault();
    const city = searchCity.trim();
    if (!city) return;

    setError("");

    const alreadyAdded = weatherReports.some(
      (w) => w.city.toLowerCase() === city.toLowerCase(),
    );

    if (alreadyAdded) {
      setError(`${city} is already on your dashboard.`);
      setSearchCity("");
      return;
    }

    try {
      const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);

      if (!res.ok) {
        setError(`Could not find "${city}". Try another city.`);
        return;
      }

      const data: Weather = await res.json();
      setWeatherReports((prev) => [...prev, data]);

      if (
        data.temperature >= 25 &&
        (data.description.toLowerCase().includes("clear") ||
          data.description.toLowerCase().includes("sunny"))
      ) {
        setRecommendations((prev) => [...prev, data]);
      }

      await fetch("/api/searches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ city: data.city }),
      });

      setSearchCity("");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
  };

  const handleDeleteCity = async (cityName: string) => {
    setWeatherReports((prev) => prev.filter((w) => w.city !== cityName));
    setRecommendations((prev) => prev.filter((r) => r.city !== cityName));

    await fetch("/api/searches", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ city: cityName }),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar loggedIn={true} />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {userName} 👋
          </h1>
          <p className="text-gray-500 mt-1">
            Here's what the weather looks like around the world today.
          </p>
        </div>

        <div className="mb-8">
          <form onSubmit={handleAddCity} className="flex gap-3 max-w-lg">
            <Input
              type="text"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              placeholder="Search a city eg. Cape Town, London..."
              className="text-gray-600"
              required
            />
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Add City
            </Button>
          </form>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-gray-500">
            <span className="animate-spin text-xl">🌀</span>
            <p>Loading weather data...</p>
          </div>
        ) : (
          <>
            <section className="mb-10">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Current Weather
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {weatherReports.map((w) => (
                  <WeatherCard
                    key={w.city}
                    {...w}
                    onDelete={handleDeleteCity}
                  />
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                ☀️ Lekker Warm Destinations
              </h2>
              {recommendations.length === 0 ? (
                <p className="text-gray-400 text-sm">
                  No sunny destinations right now. Check back later!
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendations.map((r) => (
                    <div
                      key={r.city}
                      className="bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-center">
                        <h2 className="font-bold text-gray-800">{r.city}</h2>
                        <span className="text-2xl">☀️</span>
                      </div>
                      <p className="text-4xl font-bold text-orange-500 mt-3">
                        {Math.round(r.temperature)}°
                        <span className="text-xl font-normal text-orange-300">
                          C
                        </span>
                      </p>
                      <p className="capitalize text-gray-500 text-sm mt-1">
                        {r.description}
                      </p>
                      <p className="text-xs mt-3 font-medium text-orange-400">
                        Perfect Sunny Getaway ✈️
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
