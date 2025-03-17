import { cn } from "@/lib/utils"; // If you have a utility function for class merging
import { TooltipProps } from "recharts";

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div
      className={cn(
        "p-2 rounded-md shadow-md",
        "bg-background text-foreground border border-border"
      )}
    >
      <p className="text-sm font-medium">{label}</p>
      <p className="text-lg font-bold">{`$${payload[0].value}`}</p>
    </div>
  );
};

export default CustomTooltip;