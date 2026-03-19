interface WeatherCardProps {
  city: string;
  temperature: string;
  description: string;
}

export default function WeatherCard({
  city,
  temperature,
  description,
}: WeatherCardProps) {
  return (
    <div className="bg-white p-4 rounded shadow hover:shadow-lg transiotion">
      <h2 className="font-bold text-xl">{city}</h2>
      <p>{temperature}°C</p>
      <p className="capitalize">{description}</p>
    </div>
  );
}
