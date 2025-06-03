import { Card, CardBody } from "@heroui/react";

export const StatisticsCards = ({ spaces }) => {
  const totalSpaces = spaces.length;
  const occupiedSpaces = spaces.filter((space) => space.occupied).length;
  const availableSpaces = totalSpaces - occupiedSpaces;
  const occupancyRate = totalSpaces > 0 ? Math.round((occupiedSpaces / totalSpaces) * 100) : 0;

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <Card className="flex-1">
        <CardBody className="text-center">
          <h3 className="text-gray-600 text-sm mb-2">Total Spaces</h3>
          <p className="text-2xl font-bold">{totalSpaces}</p>
        </CardBody>
      </Card>

      <Card className="flex-1">
        <CardBody className="text-center">
          <h3 className="text-gray-600 text-sm mb-2">Available</h3>
          <p className="text-2xl font-bold text-green-600">{availableSpaces}</p>
        </CardBody>
      </Card>

      <Card className="flex-1">
        <CardBody className="text-center">
          <h3 className="text-gray-600 text-sm mb-2">Occupied</h3>
          <p className="text-2xl font-bold text-red-600">{occupiedSpaces}</p>
        </CardBody>
      </Card>

      <Card className="flex-1">
        <CardBody className="text-center">
          <h3 className="text-gray-600 text-sm mb-2">Occupancy Rate</h3>
          <p className="text-2xl font-bold">{occupancyRate}%</p>
        </CardBody>
      </Card>
    </div>
  );
};
