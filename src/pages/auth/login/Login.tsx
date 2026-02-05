import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Alert } from '../../../components/ui/Alert';
import { Input, PasswordInput, Button } from '../../../components/ui/Form';
import authService from '../../../services/AuthService';
import useAuthStore from '../../../store/useAuthStore';
import styles from './Login.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const auth = new authService();

  useEffect(() => {
    checkAuth();

    if(isAuthenticated) {
      navigate("/clientes");
    }
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    auth.login({ email, password })
      .then(() => {
        checkAuth();
        setLoading(false);
        navigate('/clientes');
      })
      .catch((err) => {
        if (!err.response) {
          setError('Erro de conexão. Verifique se o servidor está online.');
        } else if (err.response.status === 401) {
          setError('Credenciais inválidas. Verifique seu email e senha.');
        } else {
          setError('Ocorreu um erro inesperado. Tente novamente mais tarde.');
        }
        setLoading(false);
      });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.loginForm}>
      <Alert message={error} type="error" />

      <Input
        placeholder="Informe seu Email: exemplo@gmail.com"
        value={email}
        onChange={setEmail} />

      <PasswordInput
        placeholder="Informe sua Senha"
        value={password}
        onChange={setPassword} />

      <Button text={loading ? "Entrando..." : "Entrar"} disabled={loading} width={"100%"} />

      <div className={styles.forgotLinkContainer}>
        <Link to="/forget-password" className={styles.forgotLink}>
          Esqueceu sua senha?
        </Link>
      </div>
    </form>
  );
}