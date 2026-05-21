import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Alert } from "../../../components/ui/Alert";
import { Input, PasswordInput, Button } from "../../../components/ui/Form";
import authService from "../../../services/AuthService";
import useAuthStore from "../../../store/useAuthStore";
import styles from "./Login.module.css";

/**
 * Mapeia o mainModule do perfil de permissão para a rota correspondente.
 * O fallback padrão é /agenda quando o módulo não está mapeado ou está ausente.
 */
function resolveRedirectPath(mainModule?: string): string {
  const moduleRouteMap: Record<string, string> = {
    SCHEDULE:      '/agenda',
    PROJECT:       '/projetos',
    CLIENT:        '/clientes',
    BUDGET:        '/projetos',
    MATERIAL:      '/materiais',
    CONFIGURATION: '/configuracoes',
  };
  return moduleRouteMap[mainModule ?? ''] ?? '/agenda';
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const checkAuth = useAuthStore((state) => state.checkAuth);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const auth = new authService();

  // Redireciona se já estiver autenticado
  if (isAuthenticated && user) {
    navigate(resolveRedirectPath(user.mainModule));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    auth
      .login({ email, password })
      .then(() => {
        checkAuth();
        setLoading(false);
        // Lê o mainModule do store após checkAuth popular os cookies
        const currentUser = useAuthStore.getState().user;
        navigate(resolveRedirectPath(currentUser?.mainModule));
      })
      .catch((err) => {
        if (!err.response) {
          setError("Erro de conexão. Verifique se o servidor está online.");
        } else if (err.response.status === 401) {
          setError("Credenciais inválidas. Verifique seu email e senha.");
        } else {
          setError("Ocorreu um erro inesperado. Tente novamente mais tarde.");
        }
        setLoading(false);
      });
  }

  return (
    <form onSubmit={handleSubmit} className={styles.loginForm}>
      <Alert message={error} type="error" />

      <Input
        placeholder="Informe seu Email: exemplo@gmail.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <PasswordInput
        placeholder="Informe sua Senha"
        value={password}
        onChange={setPassword}
      />

      <Button
        text={loading ? "Entrando..." : "Entrar"}
        disabled={loading}
        width={"100%"}
      />

      <div className={styles.forgotLinkContainer}>
        <Link to="/esqueci-senha" className={styles.forgotLink}>
          Esqueceu sua senha?
        </Link>
      </div>
    </form>
  );
}
