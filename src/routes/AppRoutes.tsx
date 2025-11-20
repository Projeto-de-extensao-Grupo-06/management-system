import { BrowserRouter, Routes, Route } from "react-router";
import Login from "../pages/Login/Login";
import AppLayout from "../layouts/AppLayout/AppLayout";
import Clients from "../pages/Clients/Clients";
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />

          <Route element={<AppLayout />}>
            <Route path="/clients" element={<Clients />} />
          </Route>

          <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}