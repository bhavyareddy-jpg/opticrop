import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function SoilAnalysis() {
  const [soilData, setSoilData] = useState([
    { id: 1, fieldName: "Field A", pH: 6.8, nitrogen: 45, phosphorus: 32, potassium: 180, moisture: 65, date: "2024-06-01" },
    { id: 2, fieldName: "Field B", pH: 7.2, nitrogen: 52, phosphorus: 28, potassium: 165, moisture: 72, date: "2024-06-01" },
  ]);

  const [newData, setNewData] = useState({ fieldName: "", pH: "", nitrogen: "", phosphorus: "", potassium: "", moisture: "" });

  const handleAddData = () => {
    if (newData.fieldName) {
      setSoilData([...soilData, {
        id: soilData.length + 1,
        fieldName: newData.fieldName,
        pH: parseFloat(newData.pH) || 0,
        nitrogen: parseInt(newData.nitrogen) || 0,
        phosphorus: parseInt(newData.phosphorus) || 0,
        potassium: parseInt(newData.potassium) || 0,
        moisture: parseInt(newData.moisture) || 0,
        date: new Date().toISOString().split('T')[0],
      }]);
      setNewData({ fieldName: "", pH: "", nitrogen: "", phosphorus: "", potassium: "", moisture: "" });
    }
  };

  const chartData = [
    { month: "Jan", pH: 6.5, nitrogen: 40, moisture: 60 },
    { month: "Feb", pH: 6.7, nitrogen: 43, moisture: 62 },
    { month: "Mar", pH: 6.8, nitrogen: 45, moisture: 65 },
    { month: "Apr", pH: 6.9, nitrogen: 48, moisture: 68 },
    { month: "May", pH: 7.0, nitrogen: 50, moisture: 70 },
    { month: "Jun", pH: 7.1, nitrogen: 52, moisture: 72 },
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Soil Analysis</h1>
            <p className="text-muted-foreground mt-2">Track and analyze soil health metrics</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Log Soil Data
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log Soil Analysis</DialogTitle>
                <DialogDescription>Record soil metrics for a field</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Field Name</Label>
                  <Input value={newData.fieldName} onChange={(e) => setNewData({...newData, fieldName: e.target.value})} />
                </div>
                <div>
                  <Label>pH Level</Label>
                  <Input type="number" step="0.1" value={newData.pH} onChange={(e) => setNewData({...newData, pH: e.target.value})} />
                </div>
                <div>
                  <Label>Nitrogen (mg/kg)</Label>
                  <Input type="number" value={newData.nitrogen} onChange={(e) => setNewData({...newData, nitrogen: e.target.value})} />
                </div>
                <div>
                  <Label>Phosphorus (mg/kg)</Label>
                  <Input type="number" value={newData.phosphorus} onChange={(e) => setNewData({...newData, phosphorus: e.target.value})} />
                </div>
                <div>
                  <Label>Potassium (mg/kg)</Label>
                  <Input type="number" value={newData.potassium} onChange={(e) => setNewData({...newData, potassium: e.target.value})} />
                </div>
                <div>
                  <Label>Soil Moisture (%)</Label>
                  <Input type="number" value={newData.moisture} onChange={(e) => setNewData({...newData, moisture: e.target.value})} />
                </div>
                <Button onClick={handleAddData} className="w-full">Log Data</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {soilData.map((data) => (
            <Card key={data.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{data.fieldName}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <p className="text-xs"><strong>pH:</strong> {data.pH}</p>
                <p className="text-xs"><strong>N:</strong> {data.nitrogen} mg/kg</p>
                <p className="text-xs"><strong>P:</strong> {data.phosphorus} mg/kg</p>
                <p className="text-xs"><strong>K:</strong> {data.potassium} mg/kg</p>
                <p className="text-xs"><strong>Moisture:</strong> {data.moisture}%</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Soil Metrics Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="pH" stroke="#3b82f6" />
                <Line type="monotone" dataKey="nitrogen" stroke="#10b981" />
                <Line type="monotone" dataKey="moisture" stroke="#f59e0b" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
