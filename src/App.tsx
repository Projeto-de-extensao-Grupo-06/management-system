import "./App.css";

import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import ProtectedRoute from "./components/security/ProtectedRoute";
import AppLayout from "./layouts/app_layout/AppLayout";
import ForgetPasswordLayout from "./layouts/login_layout/ForgetPasswordLayout";
import LoginLayout from "./layouts/login_layout/LoginLayout";
import Analysis from "./pages/analysis/Analysis";
import { ForgetPassword } from "./pages/auth/forgetPassword/ForgetPassword";
import Login from "./pages/auth/login/Login";
import ClientDetails from "./pages/clients/ClientDetails";
import Clients from "./pages/clients/Clients";
import NotFound from "./pages/shared/NotFound";
import Projects from "./pages/projects/Projects";

import useAuthStore from "./store/useAuthStore";

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LoginLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />

          <Route path="*" element={<NotFound />}></Route>
        </Route>

        <Route element={<ForgetPasswordLayout />}>
          <Route path="/esqueci-senha" element={< ForgetPassword />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/clientes" element={<Clients />} />
            <Route path="/clientes/:id" element={<ClientDetails />} />
            <Route path="/analise" element={<Analysis />}></Route>
            <Route path="/projetos" element={<Projects />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
