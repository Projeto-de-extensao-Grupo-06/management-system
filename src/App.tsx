import './App.css'

import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./pages/Login/Login";
import AppLayout from "./layouts/AppLayout/AppLayout";
import Clients from "./pages/Clients/Clients";
import NotFound from "./pages/NotFound";
import LoginLayout from './layouts/AppLayout/LoginLayout';

function App() {

  return (
    <BrowserRouter>
      <Routes>
          <Route element={<LoginLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Login />} />
          </Route>

          <Route element={<AppLayout />}>
            <Route path="/clientes" element={<Clients />} />
          </Route>

          <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
