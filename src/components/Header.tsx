import { Chip } from "@heroui/react";
import { Clock } from "lucide-react";

export const Header = ({ lastUpdated }) => {
  return (
    <div className="p-14 space-y-6 text-center bg-gradient-to-r from-indigo-600 via-blue-500 to-indigo-600 text-white">
      <h1 className="text-5xl font-bold">Smart Park</h1>

      <p className="max-w-xs mx-auto">IoT-powered management system providing parking space monitoring</p>

      <Chip size="sm" variant="flat" className="text-white">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <p>Last updated: {lastUpdated}</p>
        </div>
      </Chip>
    </div>
  );
};
