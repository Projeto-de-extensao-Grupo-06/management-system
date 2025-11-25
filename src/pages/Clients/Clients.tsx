import { useEffect, useState } from "react";
import styles from "./Clients.module.css";
import type Client from "../../interfaces/types/Client";

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    const fakeData: Client[] = [
      { id: 1, name: "João da Silva", email: "joao@email.com" },
      { id: 2, name: "Maria Oliveira", email: "maria@email.com" }
    ];

    setTimeout(() => {
      setClients(fakeData);
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

        {clients.map((c) => (
          <div key={c.id} className={styles.row}>
            <div>{c.id}</div>
            <div>{c.name}</div>
            <div>{c.email}</div>
          </div>
        ))}
      </div>
    </div>
  );
}