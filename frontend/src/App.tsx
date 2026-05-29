import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import NewVibe from "./pages/NewVibe";
import Pulse from "./pages/Pulse";
import Analytics from "./pages/Analytics";
import Rewards from "./pages/Rewards";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/feed" replace />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/feed/new" element={<NewVibe />} />
        <Route path="/pulse" element={<Pulse />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/feed" replace />} />
    </Routes>
  );
}