import { useState, useEffect } from "react";
import { Card, CardBody, Button, Chip } from "@heroui/react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { StatisticsCards } from "../components/StatisticsCards";
import { ParkingSpace } from "../components/ParkingSpace";
import { Header } from "../components/Header";
import { parkingApi } from "../services/parkingApi";
import { IParkingSpace } from "../interfaces/parking";

export const Home = () => {
  const [parkingSpaces, setParkingSpaces] = useState<IParkingSpace[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleTimeString());

  const fetchParkingData = async () => {
    try {
      const sensorsData = await parkingApi.getSensors();

      const response = await Promise.all(
        sensorsData.items.map(async (sensor) => {
          let resource = {
            contentNodes: [{ value: "slobodno", time: new Date().toISOString() }],
          };

          if (sensor.resources && sensor.resources.items && sensor.resources.items.length > 0) {
            try {
              resource = await parkingApi.getResourceData(sensor.resources.items[0].urn);
            } catch (error) {
              console.error(`Could not fetch data for resource:`, error);
            }
          }

          const sorted = [...(resource.contentNodes || [])].sort(
            (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
          );

          const parkingSpace = {
            id: sensor.urn,
            name: sensor.urn,
            resourceId: sensor.resources.items[0]?.urn || "",
            occupied: sorted[0]?.value === "zauzeto",
            lastUpdated: sorted[0]?.time,
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
    <>
      <Header lastUpdated={lastUpdated} />

      <div className="p-4 space-y-4">
        <div className="flex justify-end">
          <Button
            color="primary"
            variant="ghost"
            startContent={<RefreshCw size={16} />}
            onPress={() => fetchParkingData()}
          >
            Refresh
          </Button>
        </div>

        <StatisticsCards spaces={parkingSpaces} />

        <Card>
          <CardBody className="p-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Parking Layout</h3>
              <p className="text-slate-500">Visualization of parking space availability</p>
              {parkingSpaces.length === parkingSpaces.filter((space) => space.occupied).length &&
                parkingSpaces.length > 0 && (
                  <Chip className="mt-4 text-white" style={{ backgroundColor: "red" }}>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      <p>Parking ramp gate is closed because all spaces are occupied.</p>
                    </div>
                  </Chip>
                )}
            </div>

            <div className="flex flex-col items-center space-y-4">
              <div className="flex gap-4">
                {parkingSpaces.slice(0, Math.ceil(parkingSpaces.length / 2)).map((space) => (
                  <ParkingSpace key={space.id} space={space} />
                ))}
              </div>

              {parkingSpaces.length > 0 && (
                <div
                  className="bg-gradient-to-b from-gray-400 via-gray-300 to-gray-400 text-white px-8 py-2 rounded-md text-sm font-medium text-center"
                  style={{
                    width: `${Math.ceil(parkingSpaces.length / 2) * (112 + 16) - 16}px`,
                  }}
                >
                  Driving Lane
                </div>
              )}

              <div className="flex gap-4">
                {parkingSpaces.slice(Math.ceil(parkingSpaces.length / 2)).map((space) => (
                  <ParkingSpace key={space.id} space={space} />
                ))}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
};
