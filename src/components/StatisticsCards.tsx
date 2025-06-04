import { Card, CardBody, Progress } from "@heroui/react";
import { Car, CheckCircle, XCircle, BarChart3 } from "lucide-react";
import { IParkingSpace } from "../interfaces/parking";

export const StatisticsCards = ({ spaces }: { spaces: IParkingSpace[] }) => {
  const totalSpaces = spaces.length;
  const occupiedSpaces = spaces.filter((space) => space.occupied).length;
  const availableSpaces = totalSpaces - occupiedSpaces;
  const occupancyRate = totalSpaces > 0 ? Math.round((occupiedSpaces / totalSpaces) * 100) : 0;

  const stats = [
    {
      title: "Total Spaces",
      value: totalSpaces,
      icon: Car,
      iconColor: "text-blue-500",
    },
    {
      title: "Available",
      value: availableSpaces,
      icon: CheckCircle,
      iconColor: "text-green-500",
    },
    {
      title: "Occupied",
      value: occupiedSpaces,
      icon: XCircle,
      iconColor: "text-red-500",
    },
    {
      title: "Occupancy Rate",
      value: `${occupancyRate}%`,
      icon: BarChart3,
      iconColor: occupancyRate > 80 ? "text-red-500" : occupancyRate > 60 ? "text-yellow-500" : "text-green-500",
      progress: occupancyRate,
    },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="flex-1">
          <CardBody>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">{stat.title}</h3>
              <stat.icon className={`w-4 h-4 ${stat.iconColor}`} />
            </div>

            <div className="mt-2 space-y-2">
              <p className="text-3xl font-bold">{stat.value}</p>

              {stat.progress !== undefined && (
                <Progress
                  value={stat.progress}
                  color={stat.progress > 80 ? "danger" : stat.progress > 60 ? "warning" : "success"}
                  size="sm"
                />
              )}
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};
