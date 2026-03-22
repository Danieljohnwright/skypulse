"use client";

import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import WeatherCard from "../Components/WeatherCard";

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

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    const fetchWeather = async () => {
      // fetch user name
      try {
        const userRes = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        const userData = await userRes.json();
        setUserName(userData.name);
      } catch (err) {
        console.error("Could not fetch user:", err);
      }

      // fetch default cities
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

      // fetch saved cities
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

    try {
      const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);

      if (!res.ok) {
        alert(`Could not find "${city}". Try searching for another city`);
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

      // save city to database
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
      alert("Something went wrong. Please try again.");
    }
  };

  const avgTemp =
    weatherReports.reduce((sum, w) => sum + w.temperature, 0) /
    (weatherReports.length || 1);

  const bgClass =
    avgTemp >= 25
      ? "from-orange-200 via-yellow-100 to-red-200"
      : "from-blue-200 via-sky-100 to-indigo-200";

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bgClass}`}>
      <Navbar loggedIn={true} />

      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6 text-blue-800">
          Welcome, {userName} 👋
        </h1>

        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">Search</h2>
          <form onSubmit={handleAddCity} className="flex gap-3 max-w-md">
            <input
              type="text"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              placeholder="eg. Johannesburg, Cape Town, London"
              className="text-gray-500 flex-1 mb-5 px-5 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500 text-xl"
              required
            />
            <button
              type="submit"
              className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl transition-all"
            >
              Add City
            </button>
          </form>
        </div>

        {loading ? (
          <p className="text-gray-600">Loading weather data...</p>
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Current Weather
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {weatherReports.map((w) => (
                <WeatherCard key={w.city} {...w} />
              ))}
            </div>

            <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-800">
              Lekker Warm Destinations
            </h2>

            {recommendations.length === 0 ? (
              <p className="text-gray-600">
                No sunny destinations right now...
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((r) => (
                  <div
                    key={r.city}
                    className="bg-gradient-to-r from-yellow-200 to-orange-200 p-5 rounded-2xl shadow-md hover:shadow-xl transition"
                  >
                    <div className="flex justify-between items-center">
                      <h2 className="font-bold text-xl text-gray-800">
                        {r.city}
                      </h2>
                      <span className="text-3xl">☀️</span>
                    </div>
                    <p className="text-3xl font-semibold text-orange-600 mt-2">
                      {Math.round(r.temperature)}°C
                    </p>
                    <p className="capitalize text-gray-700 mt-1">
                      {r.description}
                    </p>
                    <p className="text-sm mt-2 font-medium text-orange-800">
                      Perfect Sunny Getaway!
                    </p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
