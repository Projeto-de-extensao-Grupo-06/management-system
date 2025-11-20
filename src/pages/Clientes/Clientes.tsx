import { useEffect, useState } from "react";
import styles from "./Clientes.module.css";

interface Cliente {
  id: number;
  nome: string;
  email: string;
}

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    // Simulação de requisição
    const fakeData: Cliente[] = [
      { id: 1, nome: "João da Silva", email: "joao@email.com" },
      { id: 2, nome: "Maria Oliveira", email: "maria@email.com" }
    ];

    setTimeout(() => {
      setClientes(fakeData);
    }, 400);
  }, []);

  return (
    <div className={styles.container}>
      <h2>Clientes</h2>

      <div className={styles.table}>
        <div className={styles.row + " " + styles.header}>
          <div>ID</div>
          <div>Nome</div>
          <div>Email</div>
        </div>

        {clientes.map((c) => (
          <div key={c.id} className={styles.row}>
            <div>{c.id}</div>
            <div>{c.nome}</div>
            <div>{c.email}</div>
          </div>
        ))}
      </div>
    </div>
  );
}