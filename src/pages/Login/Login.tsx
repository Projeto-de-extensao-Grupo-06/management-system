import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router';
import styles from './Login.module.css'; 

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // aqui vai sua lógica de login
    console.log('Login:', { email, senha });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Email */}
      <div className={styles.inputGroup}>
        <input
          type="email"
          placeholder="exemplo@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          required
        />
      </div>

      {/* Senha */}
      <div className={styles.inputGroup}>
        <input
          type={mostrarSenha ? 'text' : 'password'}
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className={styles.input}
          required
        />
        <button
          type="button"
          onClick={() => setMostrarSenha(!mostrarSenha)}
          className={styles.eyeButton}
        >
          <FontAwesomeIcon icon={mostrarSenha ? faEyeSlash : faEye} />
        </button>
      </div>

      {/* Botão Enviar */}
      <button type="submit" className={styles.submitButton}>
        Enviar
      </button>

      {/* Esqueceu a senha */}
      <Link to="/esqueci-senha" className={styles.forgotLink}>
        Esqueceu sua senha?
      </Link>
    </form>
  );
}