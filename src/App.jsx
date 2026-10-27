
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import LockBackNavigation from "./components/LockBackNavigation";
import UserRoutes from "./user/UserRoutes";
import AdminRoutes from "./admin/AdminRoutes";
import SessionTimeout from "./components/SessionTimeout";

function App() {
  return (
    <BrowserRouter>
    <LockBackNavigation/>
    <SessionTimeout/>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={<Navigate to="/user" replace />}
        />
      </Routes>

      <UserRoutes />
      <AdminRoutes />
    </BrowserRouter>
  );
}

export default App;
