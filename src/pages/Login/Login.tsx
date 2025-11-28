import { useState } from 'react';
import { Link } from 'react-router';
import styles from './Login.module.css'; 
import { Input, PasswordInput, Button } from '../../components/Form';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log('Login:', { email, password });
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

      <Button text="Entrar" />
      
      <div className={styles.forgotLinkContainer}>
        <Link to="/esqueci-senha" className={styles.forgotLink}>
          Esqueceu sua senha?
        </Link>
      </div>
    </form>
  );
}