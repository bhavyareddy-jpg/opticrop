import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Farms from "./pages/Farms";
import Fields from "./pages/Fields";
import SoilAnalysis from "./pages/SoilAnalysis";
import YieldPrediction from "./pages/YieldPrediction";
import ResourcePlanner from "./pages/ResourcePlanner";
import CropCalendar from "./pages/CropCalendar";
import Alerts from "./pages/Alerts";
import Reports from "./pages/Reports";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/farms" component={Farms} />
      <Route path="/fields" component={Fields} />
      <Route path="/soil-analysis" component={SoilAnalysis} />
      <Route path="/yield-prediction" component={YieldPrediction} />
      <Route path="/resource-planner" component={ResourcePlanner} />
      <Route path="/crop-calendar" component={CropCalendar} />
      <Route path="/alerts" component={Alerts} />
      <Route path="/reports" component={Reports} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
