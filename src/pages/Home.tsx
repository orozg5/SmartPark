import { useState, useEffect } from "react";
import { Card, CardBody, Button } from "@heroui/react";
import { RefreshCw } from "lucide-react";
import { ParkingSpace } from "../components/ParkingSpace";
import { StatisticsCards } from "../components/StatisticsCards";
import { parkingApi } from "../services/parkingApi";
import { IParkingSpace } from "../interfaces/parking";

export const Home = () => {
  const [parkingSpaces, setParkingSpaces] = useState<IParkingSpace[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());

  const fetchParkingData = async () => {
    try {
      const sensorsData = await parkingApi.getSensors();

      const response = await Promise.all(
        sensorsData.items.map(async (sensor) => {
          let resource = {
            contentNodes: [{ value: 0, time: new Date().toISOString() }],
          };

          if (sensor.resources && sensor.resources.items && sensor.resources.items.length > 0) {
            try {
              resource = await parkingApi.getResourceData(sensor.resources.items[0].urn);
            } catch (error) {
              console.error(`Could not fetch data for resource:`, error);
            }
          }

          const parkingSpace = {
            id: sensor.urn,
            name: sensor.urn,
            occupied: resource.contentNodes && resource.contentNodes[0].value < 50 ? true : false,
            lastUpdated: resource.contentNodes && resource.contentNodes[0].time,
          };

          return parkingSpace;
        })
      );

      setParkingSpaces(response);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Error fetching parking data:", error);
    }
  };

  useEffect(() => {
    fetchParkingData();
    const interval = setInterval(fetchParkingData, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Smart Park</h1>
        <p className="text-gray-600">Monitoring parking spaces</p>
      </div>

      <div className="flex flex-col items-center justify-center gap-1">
        <Button
          color="primary"
          variant="ghost"
          startContent={<RefreshCw size={16} />}
          onPress={() => fetchParkingData()}
        >
          Refresh
        </Button>
        <span className="text-gray-500 text-sm">Last updated: {lastUpdated}</span>
      </div>

      <StatisticsCards spaces={parkingSpaces} />

      <Card>
        <CardBody>
          <div className="flex flex-col items-center space-y-4">
            <div className="flex gap-4">
              {parkingSpaces.slice(0, parkingSpaces.length / 2).map((space) => (
                <ParkingSpace key={space.id} space={space} />
              ))}
            </div>

            <div className="bg-gray-400 text-white px-8 py-2 rounded-md text-sm font-medium">Driving Lane</div>

            <div className="flex gap-4">
              {parkingSpaces.slice(parkingSpaces.length / 2, parkingSpaces.length).map((space) => (
                <ParkingSpace key={space.id} space={space} />
              ))}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
