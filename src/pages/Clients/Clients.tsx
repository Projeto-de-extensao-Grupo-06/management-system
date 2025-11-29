import { useEffect, useState } from "react";
import styles from "./Clients.module.css";
import type Client from "../../interfaces/types/Client";
import ClientService from "../../services/ClientsService";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faPen, faTrashCan, faPlus, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import { SimpleButton, Button, IconButton } from '../../components/Form';

export default function Clients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [clients, setClients] = useState<Client[]>([]);
  const clientsService = new ClientService();

  const clientsMap = clients
  .map((client) => (
    <tr key={client.id}>
      <td>{client.name}</td>
      <td>{client.phone}</td>
      <td>{client.email}</td>
      <td>{client.status}</td>
      <td>
        <div className={styles.actions}>
          <IconButton 
            onClick={() => handleEdit(client.id)} 
            icon={<FontAwesomeIcon icon={faPen} />}
            ariaLabel="Editar"
            functionality="edit"/>
          <IconButton 
            onClick={() => handleDelete(client.id)} 
            icon={<FontAwesomeIcon icon={faTrashCan} />}
            ariaLabel="Deletar"
            functionality="delete"/>
        </div>
      </td>
    </tr>
  ))

  useEffect(() => {
    clientsService.getAllClients()
      .then((data: Client[]) => {
        setClients(data);
      })
      .catch((e: any) => {
        console.error('Erro ao buscar clientes:', e);
      });
  }, []);

  const handleEdit = (id: number) => {
    console.log('Editar cliente:', id);
    // TODO abrir tela de edição
  };

  const handleAddClient = () => {
    console.log('Adicionar novo cliente');
    // TODO abrir tela de cadastro
  };

  const handleFilterClient = () => {
    console.log('Filtrar clientes');
    // TODO abrir modal de filtros
  }

  const handleDelete = (id: number) => {
    clientsService.deleteClient(id)
      .then(() => {
        setClients((prevClients) => prevClients.filter(client => client.id !== id));
      })
      .catch((e: any) => {
        console.error('Erro ao deletar cliente:', e);
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          Clientes <span className={styles.count}>({clients.length})</span>
        </h1>
        <Button
          icon={<FontAwesomeIcon icon={faPlus} />}
          text="Cadastrar Cliente"
          ariaLabel="Cadastrar Cliente"
          onClick={handleAddClient}  />   
      </div>

      <div className={styles.filters}>
        <SimpleButton
          icon={<FontAwesomeIcon icon={faFilter} />}
          text="Filtros"
          ariaLabel="Filtrar Clientes"
          onClick={handleFilterClient}  />

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