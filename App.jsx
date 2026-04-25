import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/AppShell";
import DashboardPage from "./pages/DashboardPage";
import GoalPlannerPage from "./pages/GoalPlannerPage";
import LoginPage from "./pages/LoginPage";
import SavingsTrackerPage from "./pages/SavingsTrackerPage";
import SipCalculatorPage from "./pages/SipCalculatorPage";
import StockGamePage from "./pages/StockGamePage";
import ToolsPage from "./pages/ToolsPage";

function PrivateRoute({ children }) {
  const isAuthed = localStorage.getItem("wealthfy-auth") === "true";
  return isAuthed ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <AppShell />
            </PrivateRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="tools" element={<ToolsPage />} />
          <Route path="tools/sip-calculator" element={<SipCalculatorPage />} />
          <Route path="tools/goal-planner" element={<GoalPlannerPage />} />
          <Route path="tools/savings-tracker" element={<SavingsTrackerPage />} />
          <Route path="stock-game" element={<StockGamePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
