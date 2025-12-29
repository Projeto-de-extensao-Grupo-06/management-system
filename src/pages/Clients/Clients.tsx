import { faFilter, faPen, faTrashCan, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState, useMemo } from "react";
import { SimpleButton, Button, IconButton, Select, SelectOption, SearchInput } from '../../components/Form';
import type Client from "../../interfaces/types/Client";
import ClientService from "../../services/ClientsService";
import styles from "./Clients.module.css";

export default function Clients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos')
  const [clients, setClients] = useState<Client[]>([])

  const clientsService = useMemo(() => new ClientService(), []);

  useEffect(() => {
    clientsService.getAllClients()
      .then((data: Client[]) => {
        setClients(data)
      })
      .catch((e: any) => {
        console.error('Erro ao buscar clientes:', e)
      })
  }, [clientsService])

  const handleEdit = (id: number) => {
    console.log('Editar cliente:', id)
    // TODO abrir tela de edição
  }

  const handleAddClient = () => {
    console.log('Adicionar novo cliente')
    // TODO abrir tela de cadastro
  }

  const handleFilterClient = () => {
    console.log('Filtrar clientes')
    // TODO abrir modal de filtros
  }

  const handleDelete = (id: number) => {
    clientsService.deleteClient(id)
      .then(() => {
        setClients((prevClients) => prevClients.filter(client => client.id !== id))
      })
      .catch((e: any) => {
        console.error('Erro ao deletar cliente:', e)
      })
  }

  const filteredClients = useMemo(() => {
    let result = [...clients]

    if (statusFilter !== 'Todos') {
      result = result.filter(c => c.status === statusFilter)
    }

    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase()
      result = result.filter(c => c.name.toLowerCase().includes(term))
    }
    return result
  }, [clients, statusFilter, searchTerm])

  const clientsMap = filteredClients.map((client) => (
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
            functionality="edit" />
          <IconButton
            onClick={() => handleDelete(client.id)}
            icon={<FontAwesomeIcon icon={faTrashCan} />}
            ariaLabel="Deletar"
            functionality="delete" />
        </div>
      </td>
    </tr>
  ))

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
          onClick={handleAddClient}
          width="fit-content" />
      </div>

      <div className={`${styles.filters} ${styles.card}`}>
        <SimpleButton
          icon={<FontAwesomeIcon icon={faFilter} />}
          text="Filtros"
          ariaLabel="Filtrar Clientes"
          onClick={handleFilterClient} />

        <div className={styles.dropdown}>
          <Select value={statusFilter} onChange={setStatusFilter}>
            <SelectOption value="Todos" label="Todos" />
            <SelectOption value="Ativo" label="Ativo" />
            <SelectOption value="Inativo" label="Inativo" />
          </Select>
        </div>

        <div className={styles.searchBox}>
          <SearchInput
            onChange={setSearchTerm}
            value={searchTerm}
            placeholder="Buscar Cliente" />
        </div>

      </div>

      <div className={`${styles.tableWrapper} ${styles.card}`}>
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