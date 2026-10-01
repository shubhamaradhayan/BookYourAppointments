import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import Services from "./pages/services/Services";
import Availability from "./pages/availability/Availability";
import Profile from "./pages/profile/Profile";
import PublicBooking from "./pages/public/PublicBooking";
import Appointments from "./pages/appointments/Appointments";
import Home from "./pages/Home";
function App() {
  return (
    <Routes>
      {/* <Route path="/" element={<Navigate to="/dashboard" replace />} /> */}

      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/book/:slug" element={<PublicBooking />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/services" element={<Services />} />
        <Route path="/availability" element={<Availability />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
