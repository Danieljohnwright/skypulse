"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, Plus } from "lucide-react";
import { Droplet, Wind, Gauge, Eye } from "lucide-react";

interface RecommendedWeatherCardProps {
  city: string;
  temperature: number;
  feelsLike: number;
  description: string;
  humidity: number;
  windspeed: number;
  pressure?: number;
  visibility?: number;
  onAdd: () => void;
}

const getWeatherIcon = (description: string) => {
  const desc = description.toLowerCase();
  if (desc.includes("clear")) return "☀️";
  if (desc.includes("cloud")) return "☁️";
  if (desc.includes("rain")) return "🌧️";
  if (desc.includes("storm") || desc.includes("thunder")) return "⛈️";
  if (desc.includes("snow")) return "❄️";
  if (desc.includes("mist") || desc.includes("fog")) return "🌫️";
  return "🌤️";
};

export default function RecommendedWeatherCard({
  city,
  temperature,
  feelsLike,
  description,
  humidity,
  windspeed,
  pressure,
  visibility,
  onAdd,
}: RecommendedWeatherCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const icon = getWeatherIcon(description);

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all border border-orange-100 bg-gradient-to-br from-orange-50 to-yellow-50">
      <CardContent className="p-6">
        {/* Header: Icon + City + Chevron */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <span className="text-5xl">{icon}</span>
            <div>
              <h2 className="font-bold text-2xl text-gray-900">{city}</h2>
              <p className="capitalize text-gray-600 mt-1">{description}</p>
            </div>
          </div>

          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <ChevronDown
                  className={`h-5 w-5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        </div>

        {/* Temperature Section */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-6xl font-light text-orange-600 tracking-tight">
              {Math.round(temperature)}°
              <span className="text-3xl font-normal text-orange-300">C</span>
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Feels like {Math.round(feelsLike)}°C
            </p>
          </div>
        </div>

        {/* Expandable Details */}
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleContent className="pb-6">
            <div className="pt-6 border-t grid grid-cols-2 gap-x-10 gap-y-6">
              <div className="flex items-center gap-3">
                <Droplet className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <div>
                  <p className="text-gray-500 text-sm">Humidity</p>
                  <p className="font-semibold text-lg text-gray-900">
                    {humidity}%
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Wind className="h-5 w-5 text-gray-500 flex-shrink-0" />
                <div>
                  <p className="text-gray-500 text-sm">Wind Speed</p>
                  <p className="font-semibold text-lg text-gray-900">
                    {windspeed} km/h
                  </p>
                </div>
              </div>

              {pressure && (
                <div className="flex items-center gap-3">
                  <Gauge className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  <div>
                    <p className="text-gray-500 text-sm">Pressure</p>
                    <p className="font-semibold text-lg text-gray-900">
                      {pressure} hPa
                    </p>
                  </div>
                </div>
              )}

              {visibility && (
                <div className="flex items-center gap-3">
                  <Eye className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  <div>
                    <p className="text-gray-500 text-sm">Visibility</p>
                    <p className="font-semibold text-lg text-gray-900">
                      {visibility} km
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Add to Dashboard Button */}
        <Button
          onClick={onAdd}
          className="mt-4 w-full bg-orange-600 hover:bg-orange-700 text-white font-medium"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add to My Dashboard
        </Button>
      </CardContent>
    </Card>
  );
}
