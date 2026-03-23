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

  return "🌍";
};

const getTempColor = (temp: number) => {
  if (temp >= 28) return "text-red-500";
  if (temp >= 20) return "text-orange-500";
  if (temp >= 10) return "text-blue-500";
  return "text-blue-700";
};

export default function WeatherCard({
  city,
  temperature,
  description,
  onDelete,
}: WeatherCardProps) {
  return (
    <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-md hover:shadow-xl transition border border-white/40">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-xl text-gray-800">{city}</h2>
        <div className="flex items-center gap-2">
          <span className="text-3xl">{getWeatherIcon(description)}</span>
          {onDelete && (
            <button
              onClick={() => onDelete(city)}
              className="text-gray-400 hover:text-red-500 transition text-xl font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>
      <p
        className={`text-3xl font-semibold mt-2 ${getTempColor(Math.round(temperature))}`}
      >
        {Math.round(temperature)}°C
      </p>
      <p className="capitalize text-gray-600 mt-1">{description}</p>
    </div>
  );
}
