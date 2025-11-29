import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import styles from './Login.module.css'; 
import { Input, PasswordInput, Button } from '../../components/Form';
import authService from '../../services/LoginService';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const auth = new authService();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    auth.login({ email, password })
    .then((response) => { 
      const { user, message } = response;
      console.log('Usuário logado:', user); // TODO - settar zustand ou context

      setLoading(false);
      navigate('/clientes');
    })
    .catch((e) => {
      setError(e.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.');
      // alert(error);
      setLoading(false);
      navigate('/clients');
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.loginForm}>
      <Input 
        placeholder="Informe seu Email: exemplo@gmail.com" 
        value={email} 
        onChange={setEmail}/>

      <PasswordInput 
        placeholder="Informe sua Senha" 
        value={password} 
        onChange={setPassword}/>

      <Button text={loading ? "Entrando..." : "Entrar"} disabled={loading}/>
      
      <div className={styles.forgotLinkContainer}>
        <Link to="/esqueci-senha" className={styles.forgotLink}>
          Esqueceu sua senha?
        </Link>
      </div>
    </form>
  );
}