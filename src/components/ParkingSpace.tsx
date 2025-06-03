import { Card } from "@heroui/react";
import { Car } from "lucide-react";

export const ParkingSpace = ({ space }) => {
  return (
    <Card
      className={`w-24 h-24 flex items-center justify-center text-white ${
        space.occupied ? "bg-red-500" : "bg-green-500"
      }`}
    >
      <div className="text-center">
        <Car size={20} className="mx-auto" />
        <span className="text-xs font-semibold">{space.name}</span>
      </div>
    </Card>
  );
};
