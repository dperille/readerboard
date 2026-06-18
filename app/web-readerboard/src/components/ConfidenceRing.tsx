import { cn } from "@/lib/utils";

export default function ConfidenceRing({
  confidence,
  size = 64,
}: {
  confidence: number;
  size: number | undefined;
}) {
  const stroke = 4;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const offset =
    circumference -
    (Math.max(0, Math.min(100, confidence)) / 100) * circumference;

  const color =
    confidence >= 80
      ? "text-green-500"
      : confidence >= 60
        ? "text-lime-500"
        : confidence >= 40
          ? "text-yellow-500"
          : confidence >= 20
            ? "text-orange-500"
            : "text-red-500";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={stroke}
          fill="none"
          className="text-muted"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn("transition-all duration-500", color)}
        />
      </svg>
    </div>
  );
}
