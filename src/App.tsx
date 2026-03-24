import "./App.css";

import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
//import ProposalPage from "./components/pdf/ProposalPage";
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
import Config from "./pages/config/Config";
import BudgetMaterials from "./pages/materials/BudgetMaterials";
import Materials from "./pages/materials/Materials";
import ProjectDetails from "./pages/projects/ProjectDetails";
import ProjectNotifications from "./pages/projects/ProjectNotifications";
import Projects from "./pages/projects/Projects";
import Schedule from "./pages/schedule/Schedule";
import NotFound from "./pages/shared/NotFound";
import useAuthStore from "./store/useAuthStore";
import InternalServerError from "./pages/shared/InternalServerError";

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

          <Route path="/internal-server-error" element={<InternalServerError />} />
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
              path="/materiais"
              element={<PermissionRoute permissions={["BUDGET_READ"]} element={<Materials />} />}
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
            <Route
              path="/projetos/:id/materiais"
              element={<PermissionRoute permissions={["BUDGET_READ"]} element={<BudgetMaterials />} />}
            />
            <Route
              path="/materiais"
              element={<PermissionRoute permissions={["BUDGET_READ"]} element={<Materials />} />}
            />
            <Route path="/configuracoes" element={<Config />} />
            
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
