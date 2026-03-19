interface RecommendationCardProps {
  city: string;
  temperature: number;
  description: string;
}

export default function RecommendationCard({
  city,
  temperature,
  description,
}: RecommendationCardProps) {
  return (
    <div className="bg-yellow-200 p-4 rounded shadow hover:shadow-lg transition">
      <h2 className="font-bold text-xl"> {city} </h2>
      <p>
        {temperature}°C - {description}
      </p>
      <p className="text-sm text-gray-700">Sunny Destination</p>
    </div>
  );
}
