"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface WeatherCardProps {
  city: string;
  temperature: number;
  description: string;
  onDelete?: (city: string) => void;
}

const getWeatherIcon = (description: string) => {
  const desc = description.toLowerCase();
  if (desc.includes("clear")) return "☀️";
  if (desc.includes("cloud")) return "☁️";
  if (desc.includes("rain")) return "🌧️";
  if (desc.includes("storm")) return "⛈️";
  if (desc.includes("snow")) return "❄️";
  if (desc.includes("mist") || desc.includes("fog")) return "🌫️";
  return "🌍";
};

const getTempBadge = (temp: number) => {
  if (temp >= 28) return { label: "Hot", class: "bg-red-100 text-red-600" };
  if (temp >= 20)
    return { label: "Warm", class: "bg-orange-100 text-orange-600" };
  if (temp >= 10) return { label: "Cool", class: "bg-blue-100 text-blue-600" };
  return { label: "Cold", class: "bg-indigo-100 text-indigo-600" };
};

export default function WeatherCard({
  city,
  temperature,
  description,
  onDelete,
}: WeatherCardProps) {
  const badge = getTempBadge(Math.round(temperature));

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 border border-gray-100">
      <CardContent className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-bold text-lg text-gray-800">{city}</h2>
            <p className="capitalize text-gray-500 text-sm mt-0.5">
              {description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">{getWeatherIcon(description)}</span>
            {onDelete && (
              <button
                onClick={() => onDelete(city)}
                className="text-gray-300 hover:text-red-400 transition text-lg leading-none"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-end justify-between">
          <p className="text-5xl font-bold text-gray-800">
            {Math.round(temperature)}°
            <span className="text-2xl font-normal text-gray-400">C</span>
          </p>
          <Badge className={`${badge.class} border-0 font-medium`}>
            {badge.label}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
