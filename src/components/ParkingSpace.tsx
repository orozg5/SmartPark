import { Card, CardBody, Chip } from "@heroui/react";
import { Car, Clock } from "lucide-react";
import { IParkingSpace } from "../interfaces/parking";

export const ParkingSpace = ({ space }: { space: IParkingSpace }) => {
  const time = space.lastUpdated
    ? new Date(space.lastUpdated).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "N/A";

  return (
    <Card
      className={`
        w-28 h-32 bg-gradient-to-br text-white
        ${space.occupied ? "from-red-500 to-red-600" : "from-green-500 to-green-600"}
      `}
    >
      <CardBody className="items-center justify-center gap-1">
        <Car size={25} />

        <span className="text-sm mb-1">{space.name}</span>

        <Chip size="sm" variant="flat" className="text-xs text-white mb-1">
          {space.occupied ? "Occupied" : "Free"}
        </Chip>

        <div className="flex items-center gap-1">
          <Clock size={12} />
          <span className="text-xs">{time}</span>
        </div>
      </CardBody>
    </Card>
  );
};
