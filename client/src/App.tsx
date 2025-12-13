import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import NotificationSettings from "@/pages/NotificationSettings";
import AdminDashboard from "@/pages/AdminDashboard";
import RoleSelection from "@/pages/RoleSelection";
import ClassManagement from "@/pages/ClassManagement";
import BlockchainInfo from "@/pages/BlockchainInfo";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Demo from "./pages/Demo";
import TeacherDashboard from "./pages/TeacherDashboard";
import CooperationDemo from "./pages/CooperationDemo";
import ParentDashboard from "./pages/ParentDashboard";
import AvatarCustomizer from "./pages/AvatarCustomizer";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/notification-settings"} component={NotificationSettings} />
      <Route path={"/admin-dashboard"} component={AdminDashboard} />
      <Route path={"/role-selection"} component={RoleSelection} />
      <Route path={"/class-management"} component={ClassManagement} />
      <Route path={"/blockchain-info"} component={BlockchainInfo} />
      <Route path={"/demo"} component={Demo} />
      <Route path={"/teacher-dashboard"} component={TeacherDashboard} />
      <Route path={"/cooperation-demo"} component={CooperationDemo} />
      <Route path={"/parent-dashboard"} component={ParentDashboard} />
      <Route path={"/avatar-customizer"} component={AvatarCustomizer} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
