import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardBody, Button, Chip } from "@heroui/react";
import { RefreshCw, ArrowLeft } from "lucide-react";
import { Header } from "../components/Header";
import { parkingApi } from "../services/parkingApi";
import { IHistory } from "../interfaces/parking";

export const History = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [history, setHistory] = useState<IHistory | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleTimeString());

  const fetchHistory = async () => {
    if (!id) return;
    try {
      const resource = await parkingApi.getResourceData(id);
      const sorted = (resource.contentNodes || []).sort(
        (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
      );
      setHistory({
        id,
        history:
          sorted?.map((node) => ({
            time: node.time,
            value: node.value,
          })) || [],
      });
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Error fetching history data:", error);
      setHistory(null);
    }
  };

  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 30000);
    return () => clearInterval(interval);
  }, [id]);

  return (
    <>
      <Header lastUpdated={lastUpdated} />

      <div className="p-4 space-y-4">
        <div className="flex justify-between">
          <Button color="primary" variant="ghost" startContent={<ArrowLeft size={16} />} onPress={() => navigate("/")}>
            Back
          </Button>
          <Button color="primary" variant="ghost" startContent={<RefreshCw size={16} />} onPress={fetchHistory}>
            Refresh
          </Button>
        </div>

        <Card>
          <CardBody className="p-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">History for {id}</h3>
              <p className="text-slate-500">All status changes for this parking space</p>
            </div>

            <div className="flex flex-col items-center">
              {history && history.history.length > 0 ? (
                <div className="w-full max-w-md">
                  {history.history.map((entry, idx) => (
                    <div key={idx} className="flex items-center justify-between border-b py-2">
                      <span className="text-sm">{new Date(entry.time).toLocaleString()}</span>
                      <Chip
                        size="sm"
                        variant="flat"
                        className={`text-xs text-white ${entry.value === "zauzeto" ? "bg-red-500" : "bg-green-500"}`}
                      >
                        {entry.value === "zauzeto" ? "Occupied" : "Free"}
                      </Chip>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No history available.</p>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
};
