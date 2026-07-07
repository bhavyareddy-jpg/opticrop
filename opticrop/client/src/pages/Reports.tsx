import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Download } from "lucide-react";

export default function Reports() {
  const yieldData = [
    { field: "Field A", yield: 5.2, target: 5.0 },
    { field: "Field B", yield: 4.8, target: 5.0 },
    { field: "Field C", yield: 5.5, target: 5.0 },
  ];

  const trendData = [
    { month: "Jan", health: 75, moisture: 60 },
    { month: "Feb", health: 78, moisture: 62 },
    { month: "Mar", health: 82, moisture: 65 },
    { month: "Apr", health: 85, moisture: 68 },
    { month: "May", health: 88, moisture: 70 },
    { month: "Jun", health: 90, moisture: 72 },
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground mt-2">Farm and field performance analytics</p>
          </div>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Yield Performance</CardTitle>
            <CardDescription>Actual vs Target Yield by Field</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={yieldData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="field" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="yield" fill="#10b981" name="Actual Yield (T/ha)" />
                <Bar dataKey="target" fill="#3b82f6" name="Target Yield (T/ha)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Farm Health Trend</CardTitle>
            <CardDescription>6-month performance overview</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="health" stroke="#10b981" strokeWidth={2} name="Crop Health %" />
                <Line type="monotone" dataKey="moisture" stroke="#3b82f6" strokeWidth={2} name="Soil Moisture %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
