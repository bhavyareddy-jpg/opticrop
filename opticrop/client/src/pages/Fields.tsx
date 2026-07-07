import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";

export default function Fields() {
  const [fields, setFields] = useState([
    { id: 1, name: "Field A", cropType: "Wheat", area: 50, plantingDate: "2024-03-15", growthStage: "Flowering" },
    { id: 2, name: "Field B", cropType: "Corn", area: 75, plantingDate: "2024-04-01", growthStage: "Vegetative" },
  ]);

  const [newField, setNewField] = useState({ name: "", cropType: "", area: "", plantingDate: "" });

  const handleAddField = () => {
    if (newField.name) {
      setFields([...fields, {
        id: fields.length + 1,
        name: newField.name,
        cropType: newField.cropType,
        area: parseInt(newField.area) || 0,
        plantingDate: newField.plantingDate,
        growthStage: "Seedling",
      }]);
      setNewField({ name: "", cropType: "", area: "", plantingDate: "" });
    }
  };

  const handleDeleteField = (id: number) => {
    setFields(fields.filter(f => f.id !== id));
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Fields Management</h1>
            <p className="text-muted-foreground mt-2">Manage your farm fields and crops</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Field
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Field</DialogTitle>
                <DialogDescription>Add a new field to your farm</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Field Name</Label>
                  <Input
                    value={newField.name}
                    onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                    placeholder="e.g., Field A"
                  />
                </div>
                <div>
                  <Label>Crop Type</Label>
                  <Input
                    value={newField.cropType}
                    onChange={(e) => setNewField({ ...newField, cropType: e.target.value })}
                    placeholder="e.g., Wheat"
                  />
                </div>
                <div>
                  <Label>Area (hectares)</Label>
                  <Input
                    type="number"
                    value={newField.area}
                    onChange={(e) => setNewField({ ...newField, area: e.target.value })}
                    placeholder="Enter area"
                  />
                </div>
                <div>
                  <Label>Planting Date</Label>
                  <Input
                    type="date"
                    value={newField.plantingDate}
                    onChange={(e) => setNewField({ ...newField, plantingDate: e.target.value })}
                  />
                </div>
                <Button onClick={handleAddField} className="w-full">Create Field</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {fields.map((field) => (
            <Card key={field.id}>
              <CardHeader>
                <CardTitle>{field.name}</CardTitle>
                <CardDescription>{field.cropType}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <p className="text-sm"><strong>Area:</strong> {field.area} ha</p>
                  <p className="text-sm"><strong>Planting:</strong> {field.plantingDate}</p>
                  <p className="text-sm"><strong>Stage:</strong> {field.growthStage}</p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteField(field.id)}
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
