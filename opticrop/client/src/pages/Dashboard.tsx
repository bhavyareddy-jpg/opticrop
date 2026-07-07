import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  // Mock data for demonstration
  const mockChartData = [
    { month: "Jan", moisture: 65, health: 85, yield: 4200 },
    { month: "Feb", moisture: 70, health: 87, yield: 4400 },
    { month: "Mar", moisture: 75, health: 90, yield: 4600 },
    { month: "Apr", moisture: 72, health: 88, yield: 4800 },
    { month: "May", moisture: 68, health: 86, yield: 5000 },
    { month: "Jun", moisture: 80, health: 92, yield: 5200 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome to OptiCrop - Smart Agricultural Optimization</p>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Crop Health Index</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">88%</div>
              <p className="text-xs text-green-600 mt-1">↑ 5% from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Soil Moisture</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">72%</div>
              <p className="text-xs text-muted-foreground mt-1">Optimal range</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Yield Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5.2T/ha</div>
              <p className="text-xs text-green-600 mt-1">↑ 8% YoY</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Resource Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92%</div>
              <p className="text-xs text-muted-foreground mt-1">Efficiency</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Card>
          <CardHeader>
            <CardTitle>Farm Metrics Trend</CardTitle>
            <CardDescription>6-month performance overview</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="moisture" stroke="#3b82f6" strokeWidth={2} name="Soil Moisture %" />
                <Line type="monotone" dataKey="health" stroke="#10b981" strokeWidth={2} name="Crop Health %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Yield Forecast</CardTitle>
            <CardDescription>Projected yield per month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="yield" fill="#10b981" radius={[8, 8, 0, 0]} name="Yield (kg/ha)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
