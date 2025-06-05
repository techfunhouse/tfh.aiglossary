import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { LoginPage } from "@/components/login-page";
import { Dashboard } from "@/pages/dashboard";
import { PublicDashboard } from "@/pages/public-dashboard";

function AppContent() {
  const isDevelopment = import.meta.env.DEV;
  const { user, isLoading } = isDevelopment ? useAuth() : { user: null, isLoading: false };

  return (
    <Switch>
      {isDevelopment && (
        <Route path="/login">
          {isLoading ? (
            <div className="min-h-screen flex items-center justify-center bg-secondary-50">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
            </div>
          ) : user ? (
            <Dashboard />
          ) : (
            <LoginPage />
          )}
        </Route>
      )}
      {isDevelopment && (
        <Route path="/admin">
          {isLoading ? (
            <div className="min-h-screen flex items-center justify-center bg-secondary-50">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
            </div>
          ) : user ? (
            <Dashboard />
          ) : (
            <LoginPage />
          )}
        </Route>
      )}
      <Route>
        <PublicDashboard />
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
