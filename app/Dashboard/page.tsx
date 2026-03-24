"use client";

import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import WeatherCard from "../Components/WeatherCard";
import RecommendedWeatherCard from "../Components/RecommendedWeatherCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Weather {
  city: string;
  temperature: number;
  feelsLike: number;
  description: string;
  humidity: number;
  windspeed: number;
  pressure?: number;
  visibility?: number;
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
            const res = await fetch(
              `/api/weather?city=${encodeURIComponent(city)}`,
            );
            if (!res.ok) return null;
            return res.json();
          }),
        );

        const validResults = results.filter((r): r is Weather => r !== null);
        setWeatherReports(validResults);

        // Automatic Recommended Warm Cities
        const recommendedCityNames = ["Cape Town", "Miami", "Bangkok"];

        const recResults = await Promise.all(
          recommendedCityNames.map(async (city) => {
            const res = await fetch(
              `/api/weather?city=${encodeURIComponent(city)}`,
            );
            if (!res.ok) return null;
            return res.json();
          }),
        );

        const validRecs = recResults.filter((r): r is Weather => r !== null);

        const sunnyRecs = validRecs.filter(
          (city) =>
            city.temperature >= 24 &&
            (city.description.toLowerCase().includes("clear") ||
              city.description.toLowerCase().includes("sunny") ||
              city.description.toLowerCase().includes("few clouds")),
        );

        setRecommendations(
          sunnyRecs.length >= 2 ? sunnyRecs : validRecs.slice(0, 3),
        );
      } catch (error) {
        console.error("Fetch error:", error);
        setRecommendations([]);
      }

      try {
        const savedRes = await fetch("/api/searches", {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        const savedData = await savedRes.json();

        if (savedData.cities && savedData.cities.length > 0) {
          const results = await Promise.all(
            savedData.cities.map(async (city: string) => {
              const res = await fetch(
                `/api/weather?city=${encodeURIComponent(city)}`,
              );
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

  const handleAddCityFromRec = async (cityName: string) => {
    const alreadyAdded = weatherReports.some(
      (w) => w.city.toLowerCase() === cityName.toLowerCase(),
    );

    if (alreadyAdded) {
      setError(`${cityName} is already on your dashboard.`);
      return;
    }

    try {
      const res = await fetch(
        `/api/weather?city=${encodeURIComponent(cityName)}`,
      );
      if (!res.ok) {
        setError(`Could not fetch "${cityName}".`);
        return;
      }

      const data: Weather = await res.json();

      setWeatherReports((prev) => [...prev, data]);

      await fetch("/api/searches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ city: data.city }),
      });

      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to add city. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar loggedIn={true} />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {userName} !
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
                    city={w.city}
                    temperature={w.temperature}
                    description={w.description}
                    feelsLike={w.feelsLike}
                    humidity={w.humidity}
                    windspeed={w.windspeed}
                    pressure={w.pressure}
                    visibility={w.visibility}
                    onDelete={handleDeleteCity}
                  />
                ))}
              </div>
            </section>

            {/* Updated Recommended Section with expandable cards */}
            <section>
              <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                ☀️ Lekker Warm Destinations
                <span className="text-xs font-normal text-gray-400">
                  (Recommended)
                </span>
              </h2>

              {recommendations.length === 0 ? (
                <p className="text-gray-400 text-sm">
                  No sunny warm destinations right now. Check back later!
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendations.map((r) => (
                    <RecommendedWeatherCard
                      key={r.city}
                      city={r.city}
                      temperature={r.temperature}
                      feelsLike={r.feelsLike}
                      description={r.description}
                      humidity={r.humidity}
                      windspeed={r.windspeed}
                      pressure={r.pressure}
                      visibility={r.visibility}
                      onAdd={() => handleAddCityFromRec(r.city)}
                    />
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
