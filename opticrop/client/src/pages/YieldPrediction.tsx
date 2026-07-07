import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function YieldPrediction() {
  const predictionData = [
    { month: "Jan", predicted: 3500, actual: 3400 },
    { month: "Feb", predicted: 3800, actual: 3750 },
    { month: "Mar", predicted: 4200, actual: 4100 },
    { month: "Apr", predicted: 4600, actual: 4550 },
    { month: "May", predicted: 5000, actual: 4950 },
    { month: "Jun", predicted: 5200, actual: 5150 },
  ];

  const fieldYield = [
    { field: "Field A", predicted: 5.2, confidence: 92 },
    { field: "Field B", predicted: 4.8, confidence: 88 },
    { field: "Field C", predicted: 5.5, confidence: 90 },
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Yield Prediction</h1>
          <p className="text-muted-foreground mt-2">AI-powered yield forecasting based on field data</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {fieldYield.map((field, idx) => (
            <Card key={idx}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{field.field}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{field.predicted}T/ha</div>
                <p className="text-xs text-green-600 mt-1">Confidence: {field.confidence}%</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Yield Trend Analysis</CardTitle>
            <CardDescription>Predicted vs Actual Yield</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={predictionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="predicted" stroke="#3b82f6" strokeWidth={2} name="Predicted" />
                <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} name="Actual" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Field-wise Yield Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={fieldYield}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="field" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="predicted" fill="#10b981" radius={[8, 8, 0, 0]} name="Predicted Yield (T/ha)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
