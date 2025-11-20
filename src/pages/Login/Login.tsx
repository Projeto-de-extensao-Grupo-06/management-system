import styles from "./Login.module.css";

export default function Login() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // lógica de login
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Login</h2>

        <input type="text" placeholder="Usuário" />
        <input type="password" placeholder="Senha" />

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}