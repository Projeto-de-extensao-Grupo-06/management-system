import { useEffect, useState } from "react";
import styles from "./Clients.module.css";
import type Client from "../../interfaces/types/Client";
import clientService from "../../services/ClientsService";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faPen, faTrashCan, faPlus, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import { Button } from '../../components/Form';

export default function Clients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [clients, setClients] = useState<Client[]>([]);

  const clientsMap = clients
  .map((client) => (
    <tr key={client.id}>
      <td>{client.name}</td>
      <td>{client.phone}</td>
      <td>{client.email}</td>
      <td>{client.status}</td>
      <td>
        <div className={styles.actions}>
          <Button 
            text={''} 
            onClick={() => handleEdit(client.id)} 
            icon={<FontAwesomeIcon icon={faPen} />}
            ariaLabel="Editar"/>
          <Button 
            text={''} 
            onClick={() => handleDelete(client.id)} 
            icon={<FontAwesomeIcon icon={faTrashCan} />}
            ariaLabel="Deletar"/>
        </div>
      </td>
    </tr>
  ))

  useEffect(() => {
    const client = new clientService();
    client.getAllClients()
      .then((data) => {
        setClients(data);
      })
      .catch((e: any) => {
        console.error('Erro ao buscar clientes:', e);
      });
  }, []);

  const handleEdit = (id: number) => {
    console.log('Editar cliente:', id);
  };

  const handleDelete = (id: number) => {
    console.log('Deletar cliente:', id);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          Clientes <span className={styles.count}>({clients.length})</span>
        </h1>
        <button className={styles.addButton}>
          <FontAwesomeIcon icon={faPlus} />
          Cadastrar Cliente
        </button>
      </div>

      <div className={styles.filters}>
        <button className={styles.filterButton}>
          <FontAwesomeIcon icon={faFilter} />
          Filtro
        </button>

        <div className={styles.dropdown}>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.select}>
            <option value="todos">Todos os status</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>

        <div className={styles.searchBox}>
          <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.searchIcon}  />
          <input
            type="text"
            placeholder="Buscar Cliente"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome do Cliente</th>
              <th>Telefone</th>
              <th>Email</th>
              <th>Status</th>
              <th>Operação</th>
            </tr>
          </thead>
          <tbody>
            {clientsMap}
          </tbody>
        </table>
      </div>
    </div>
  );
}