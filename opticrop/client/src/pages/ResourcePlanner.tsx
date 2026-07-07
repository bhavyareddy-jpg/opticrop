import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function ResourcePlanner() {
  const recommendations = [
    { field: "Field A", resource: "Fertilizer", amount: "150 kg", reason: "Low nitrogen levels", priority: "High" },
    { field: "Field B", resource: "Water", amount: "50 mm", reason: "Soil moisture below 60%", priority: "Medium" },
    { field: "Field C", resource: "Pesticide", amount: "10 L", reason: "Pest detection alert", priority: "High" },
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resource Optimization Planner</h1>
          <p className="text-muted-foreground mt-2">Get AI-powered recommendations for optimal resource allocation</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Fertilizer Needed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">450 kg</div>
              <p className="text-xs text-muted-foreground">Across all fields</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Water Requirement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">150 mm</div>
              <p className="text-xs text-muted-foreground">Next 30 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Estimated Cost</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2,450</div>
              <p className="text-xs text-muted-foreground">Total investment</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Resource Recommendations</CardTitle>
            <CardDescription>Optimized allocation based on field conditions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                      <p className="font-semibold">{rec.field} - {rec.resource}</p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{rec.reason}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{rec.amount}</p>
                    <p className={`text-xs ${rec.priority === 'High' ? 'text-red-600' : 'text-yellow-600'}`}>{rec.priority}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Button className="w-full" size="lg">Generate Detailed Report</Button>
      </div>
    </div>
  );
}
