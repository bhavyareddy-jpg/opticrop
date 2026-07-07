import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit2, Trash2 } from "lucide-react";

export default function Farms() {
  const [farms, setFarms] = useState([
    { id: 1, name: "Green Valley Farm", location: "California", area: 150, createdAt: new Date() },
    { id: 2, name: "Sunny Acres", location: "Texas", area: 200, createdAt: new Date() },
  ]);

  const [newFarm, setNewFarm] = useState({ name: "", location: "", area: "" });

  const handleAddFarm = () => {
    if (newFarm.name) {
      setFarms([...farms, {
        id: farms.length + 1,
        name: newFarm.name,
        location: newFarm.location,
        area: parseInt(newFarm.area) || 0,
        createdAt: new Date(),
      }]);
      setNewFarm({ name: "", location: "", area: "" });
    }
  };

  const handleDeleteFarm = (id: number) => {
    setFarms(farms.filter(f => f.id !== id));
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Farms Management</h1>
            <p className="text-muted-foreground mt-2">Manage your agricultural farms</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Farm
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Farm</DialogTitle>
                <DialogDescription>Add a new farm to your portfolio</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Farm Name</Label>
                  <Input
                    value={newFarm.name}
                    onChange={(e) => setNewFarm({ ...newFarm, name: e.target.value })}
                    placeholder="Enter farm name"
                  />
                </div>
                <div>
                  <Label>Location</Label>
                  <Input
                    value={newFarm.location}
                    onChange={(e) => setNewFarm({ ...newFarm, location: e.target.value })}
                    placeholder="Enter location"
                  />
                </div>
                <div>
                  <Label>Total Area (hectares)</Label>
                  <Input
                    type="number"
                    value={newFarm.area}
                    onChange={(e) => setNewFarm({ ...newFarm, area: e.target.value })}
                    placeholder="Enter area"
                  />
                </div>
                <Button onClick={handleAddFarm} className="w-full">Create Farm</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {farms.map((farm) => (
            <Card key={farm.id}>
              <CardHeader>
                <CardTitle>{farm.name}</CardTitle>
                <CardDescription>{farm.location}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <p className="text-sm"><strong>Area:</strong> {farm.area} ha</p>
                  <p className="text-sm text-muted-foreground">Created: {farm.createdAt.toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteFarm(farm.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
