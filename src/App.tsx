import "./App.css";

import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import PermissionRoute from "./components/security/PermissionsRoute";
import ProtectedRoute from "./components/security/ProtectedRoute";
import AppLayout from "./layouts/app_layout/AppLayout";
import ForgetPasswordLayout from "./layouts/login_layout/ForgetPasswordLayout";
import LoginLayout from "./layouts/login_layout/LoginLayout";
import Analysis from "./pages/analysis/Analysis";
import { ForgetPassword } from "./pages/auth/forgetPassword/ForgetPassword";
import Login from "./pages/auth/login/Login";
import BudgetDetails from "./pages/Budget/BudgetDetails";
import ClientDetails from "./pages/clients/ClientDetails";
import Clients from "./pages/clients/Clients";
import ProjectDetails from "./pages/projects/ProjectDetails";
import ProjectNotifications from "./pages/projects/ProjectNotifications";
import Projects from "./pages/projects/Projects";
import Schedule from "./pages/schedule/Schedule";
import NotFound from "./pages/shared/NotFound";
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
            <Route
              path="/agenda"
              element={<PermissionRoute permissions={["SCHEDULE_READ"]} element={<Schedule />} />}
            />

            <Route
              path="/clientes"
              element={<PermissionRoute permissions={["CLIENT_READ"]} element={<Clients />} />}
            />

            <Route
              path="/clientes/:id"
              element={<PermissionRoute permissions={["CLIENT_READ"]} element={<ClientDetails />} />}
            />

            <Route
              path="/projetos/:id"
              element={<PermissionRoute permissions={["PROJECT_READ"]} element={<ProjectDetails />} />}
            />

            <Route
              path="/analise"
              element={<PermissionRoute permissions={["BUDGET_READ"]} element={<Analysis />} />}
            />

            <Route
              path="/projetos"
              element={<PermissionRoute permissions={["PROJECT_READ"]} element={<Projects />} />}
            />

            <Route
              path="/projetos/notificacoes"
              element={<PermissionRoute permissions={["PROJECT_READ"]} element={<ProjectNotifications />} />}
            />

            <Route
              path="/projetos/:id/orcamento"
              element={<PermissionRoute permissions={["BUDGET_READ"]} element={<BudgetDetails />} />}
            />

          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
