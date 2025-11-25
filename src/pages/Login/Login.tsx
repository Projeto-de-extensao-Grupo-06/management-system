import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router';
import styles from './Login.module.css'; 

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log('Login:', { email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input 
        placeholder="Informe seu Email: exemplo@gmail.com" 
        value={email} 
        onChange={setEmail}/>

      <PasswordInput 
        placeholder="Informe sua Senha" 
        value={password} 
        onChange={setPassword}/>

      <Button text="Entrar" />
      
      <Link to="/esqueci-senha" className={styles.forgotLink}>
        Esqueceu sua senha?
      </Link>
    </form>
  );
}