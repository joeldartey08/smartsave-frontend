import { Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Landing from "./pages/user/Landing";
import ProtectedRoute from "./component/user/ProtectedRoute";
import ForgottenPassword from "./pages/ForgottenPassword";
import SavingPlan from "./pages/user/SavingPlan";
import Profile from "./pages/user/Profile";
import SavingHistory from "./pages/user/SavingHistory";
import Analytics from "./pages/user/Analytics";
import Balance from "./pages/user/Balance";
import PlanItem from "./component/PlanItem";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/recover-password" element={<ForgottenPassword />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Landing />
          </ProtectedRoute>
        }
      />
      <Route
        path="/savings-plan"
        element={
          <ProtectedRoute>
            <SavingPlan />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <SavingHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/balance"
        element={
          <ProtectedRoute>
            <Balance />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
