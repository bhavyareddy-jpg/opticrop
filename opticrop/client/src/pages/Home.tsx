import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Home() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">OptiCrop</h1>
          <p className="text-xl text-gray-600">Smart Agricultural Production Optimization Engine</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Button onClick={() => navigate("/dashboard")} className="h-20 text-lg">Dashboard</Button>
          <Button onClick={() => navigate("/farms")} className="h-20 text-lg">Farms</Button>
          <Button onClick={() => navigate("/fields")} className="h-20 text-lg">Fields</Button>
          <Button onClick={() => navigate("/soil-analysis")} className="h-20 text-lg">Soil Analysis</Button>
          <Button onClick={() => navigate("/yield-prediction")} className="h-20 text-lg">Yield Prediction</Button>
          <Button onClick={() => navigate("/resource-planner")} className="h-20 text-lg">Resource Planner</Button>
          <Button onClick={() => navigate("/crop-calendar")} className="h-20 text-lg">Crop Calendar</Button>
          <Button onClick={() => navigate("/alerts")} className="h-20 text-lg">Alerts</Button>
          <Button onClick={() => navigate("/reports")} className="h-20 text-lg">Reports</Button>
        </div>
      </div>
    </div>
  );
}
