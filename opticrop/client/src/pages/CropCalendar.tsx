import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";

export default function CropCalendar() {
  const [events, setEvents] = useState([
    { id: 1, field: "Field A", event: "Planting", date: "2024-03-15", status: "Completed" },
    { id: 2, field: "Field A", event: "Irrigation", date: "2024-04-01", status: "Completed" },
    { id: 3, field: "Field B", event: "Fertilization", date: "2024-06-15", status: "Upcoming" },
    { id: 4, field: "Field B", event: "Harvest", date: "2024-09-01", status: "Upcoming" },
  ]);

  const [newEvent, setNewEvent] = useState({ field: "", event: "", date: "" });

  const handleAddEvent = () => {
    if (newEvent.field && newEvent.event && newEvent.date) {
      setEvents([...events, {
        id: events.length + 1,
        field: newEvent.field,
        event: newEvent.event,
        date: newEvent.date,
        status: "Upcoming",
      }]);
      setNewEvent({ field: "", event: "", date: "" });
    }
  };

  const handleDeleteEvent = (id: number) => {
    setEvents(events.filter(e => e.id !== id));
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Crop Calendar</h1>
            <p className="text-muted-foreground mt-2">Schedule and track crop management events</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule Event</DialogTitle>
                <DialogDescription>Add a crop management event</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Field</Label>
                  <Input value={newEvent.field} onChange={(e) => setNewEvent({...newEvent, field: e.target.value})} placeholder="e.g., Field A" />
                </div>
                <div>
                  <Label>Event Type</Label>
                  <Input value={newEvent.event} onChange={(e) => setNewEvent({...newEvent, event: e.target.value})} placeholder="e.g., Irrigation" />
                </div>
                <div>
                  <Label>Date</Label>
                  <Input type="date" value={newEvent.date} onChange={(e) => setNewEvent({...newEvent, date: e.target.value})} />
                </div>
                <Button onClick={handleAddEvent} className="w-full">Schedule Event</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-2">
          {events.map((event) => (
            <Card key={event.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-semibold">{event.field} - {event.event}</p>
                  <p className="text-sm text-muted-foreground">{event.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${event.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                    {event.status}
                  </span>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteEvent(event.id)}>
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
