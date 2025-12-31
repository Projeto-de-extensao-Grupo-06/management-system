import { faFilter, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useMemo, useRef, useState } from "react";
import ClientForm from '../../components/ClientForm/ClientForm';
import type { ClientFormRef } from '../../components/ClientForm/ClientForm';
import ClientTable from '../../components/ClientTable/ClientTable';
import { Button, SearchInput, Select, SelectOption, SimpleButton } from '../../components/Form';
import FilterBar from '../../components/Layout/FilterBar';
import PageHeader from '../../components/Layout/PageHeader';
import Modal from '../../components/Modal/Modal';
import type Client from "../../interfaces/types/Client";
import type { ClientSchemaType } from '../../schemas/clientSchema';
import ClientService from "../../services/ClientsService";
import styles from "./Clients.module.css";

export default function Clients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos')
  const [clients, setClients] = useState<Client[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const formRef = useRef<ClientFormRef>(null);
  const [clientFormData, setClientFormData] = useState<Partial<ClientSchemaType>>({});

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
    setIsCreateModalOpen(true);
  }

  const handleCreateSubmit = () => {
    formRef.current?.submit();
  }

  const onFormSubmit = (data: ClientSchemaType) => {
    clientsService.createClient(data)
      .then((newClient) => {
        setClients(prev => [...prev, newClient]);
        setClientFormData({});
        setIsCreateModalOpen(false);
      })
      .catch((e) => {
        console.error("Error creating client", e);
      });
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

  const modalFooter = (
    <Button
      icon={<FontAwesomeIcon icon={faPlus} />}
      text="Cadastrar Cliente"
      ariaLabel="Confirmar cadastro"
      onClick={handleCreateSubmit}
      width="fit-content"
    />
  );

  return (
    <div className={styles.container}>
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Criar Cliente"
        footer={modalFooter}
      >
        <ClientForm
          ref={formRef}
          onSubmit={onFormSubmit}
          defaultValues={clientFormData}
          onFormChange={setClientFormData}
        />
      </Modal>

      <PageHeader title="Clientes" count={clients.length}>
        <Button
          icon={<FontAwesomeIcon icon={faPlus} />}
          text="Cadastrar Cliente"
          ariaLabel="Cadastrar Cliente"
          onClick={handleAddClient}
          width="fit-content"
        />
      </PageHeader>

      <FilterBar>
        <SimpleButton
          icon={<FontAwesomeIcon icon={faFilter} />}
          text="Filtros"
          ariaLabel="Filtrar Clientes"
          onClick={handleFilterClient}
        />

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
            placeholder="Buscar Cliente"
          />
        </div>
      </FilterBar>

      <ClientTable
        clients={filteredClients}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
