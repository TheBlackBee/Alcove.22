import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MobileMenuProvider } from "./lib/MobileMenuContext";
import NotFound from "@/pages/not-found";
import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/components/layout/TopNav";
import Dashboard from "@/pages/Dashboard";
import Responses from "@/pages/Responses";
import History from "@/pages/History";
import { useMobile } from "@/hooks/use-mobile";

function Router() {
  const [location] = useLocation();
  const isMobile = useMobile();

  return (
    <div className="flex h-screen overflow-hidden">
      {!isMobile && <Sidebar activeRoute={location} />}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />
        
        <main className="flex-1 overflow-y-auto p-6 bg-neutral-100">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/profile" component={Profile} />
            <Route path="/community" component={Community} />
            <Route path="/chores" component={Chores} />
            <Route path="/banking" component={Banking} />
            <Route path="/kitchen" component={ComingSoon} />
            <Route path="/goals" component={Goals} />
            <Route path="/schedule" component={Schedule} />
            <Route path="/points" component={Points} />
            <Route path="/settings" component={Settings} />
            <Route path="/settings/notifications" component={Notifications} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <MobileMenuProvider>
          <Toaster />
          <Router />
        </MobileMenuProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
