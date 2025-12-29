import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Alert } from '../../components/Alert';
import { Input, PasswordInput, Button } from '../../components/Form';
import authService from '../../services/LoginService';
import useAuthStore from '../../store/useAuthStore';
import styles from './Login.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const checkAuth = useAuthStore((state) => state.checkAuth);

  const auth = new authService();

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
      .catch(() => {
        setError('Erro ao fazer login. Verifique suas credenciais.');
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
        <Link to="/esqueci-senha" className={styles.forgotLink}>
          Esqueceu sua senha?
        </Link>
      </div>
    </form>
  );
}