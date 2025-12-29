import "./App.css";

import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import AppLayout from "./layouts/AppLayout/AppLayout";
import LoginLayout from "./layouts/AppLayout/LoginLayout";
import Analysis from "./pages/Analysis/Analysis";
import Clients from "./pages/Clients/Clients";
import Login from "./pages/Login/Login";
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

        <Route element={<AppLayout />}>
          <Route path="/clientes" element={<Clients />} />
          <Route path="/analise" element={<Analysis />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
