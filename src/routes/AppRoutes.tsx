import { BrowserRouter, Routes, Route } from "react-router";
//import Login from "../pages/Login/Login";
import AppLayout from "../layouts/AppLayout/AppLayout";
import Clientes from "../pages/Clientes/Clientes";

export default function AppRoutes() {
  return (
    <BrowserRouter>
        <AppLayout>
            <Routes>
                <Route path="/" element={<div>Home Page</div>} />
                <Route path="/clientes" element={<Clientes />} />
            </Routes>
        </AppLayout>
    </BrowserRouter>
  );
}