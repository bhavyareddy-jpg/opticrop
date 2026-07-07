import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";

export default function Alerts() {
  const [alerts] = useState([
    { id: 1, type: "Critical", field: "Field A", message: "Soil moisture critically low", priority: "High", date: "2024-06-15" },
    { id: 2, type: "Warning", field: "Field B", message: "Nitrogen levels below optimal", priority: "Medium", date: "2024-06-14" },
    { id: 3, type: "Info", field: "Field C", message: "Upcoming harvest window in 5 days", priority: "Low", date: "2024-06-13" },
  ]);

  const getIcon = (type: string) => {
    if (type === "Critical") return <AlertCircle className="h-5 w-5 text-red-600" />;
    if (type === "Warning") return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    return <CheckCircle className="h-5 w-5 text-blue-600" />;
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alerts & Recommendations</h1>
          <p className="text-muted-foreground mt-2">Monitor farm alerts and actionable recommendations</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Critical Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">1</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Warnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">1</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">1</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-3">
          {alerts.map((alert) => (
            <Card key={alert.id}>
              <CardContent className="flex items-start gap-4 p-4">
                {getIcon(alert.type)}
                <div className="flex-1">
                  <p className="font-semibold">{alert.field} - {alert.message}</p>
                  <p className="text-sm text-muted-foreground mt-1">{alert.date}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${alert.priority === 'High' ? 'bg-red-100 text-red-800' : alert.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                  {alert.priority}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
