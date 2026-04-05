import { faFilter, faPen, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

import Modal from "../../components/dialogs/modal/Modal";
import FilterBar from "../../components/layout/FilterBar";
import PageLayout from "../../components/layout/PageLayout";
import Table from "../../components/tables/Table";
import {
  BackButton,
  Button,
  IconButton,
  SearchInput,
  Select,
  SelectOption,
  SimpleButton,
} from "../../components/ui/Form";
import clientStyles from "../clients/Clients.module.css";
import styles from "./CoworkersManagementPage.module.css";

type CoworkerRole = "Vendedor" | "Suporte";
type CoworkerFilter = "Todos os colaboredoes" | "Vendedores" | "Suporte";
type ModalMode = "add" | "edit" | null;

interface Coworker {
  id: number;
  name: string;
  role: CoworkerRole;
  email: string;
  phone: string;
}

const INITIAL_COWORKERS: Coworker[] = [
  {
    id: 1,
    name: "João Silva",
    role: "Vendedor",
    email: "joao.silva@empresa.com",
    phone: "(11) 98765-4321",
  },
  {
    id: 2,
    name: "Maria Santos",
    role: "Vendedor",
    email: "maria.santos@empresa.com",
    phone: "(11) 97654-3210",
  },
  {
    id: 3,
    name: "Carlos Oliveira",
    role: "Suporte",
    email: "carlos.oliveira@empresa.com",
    phone: "(11)96543-2109",
  },
  {
    id: 4,
    name: "Ana Paula",
    role: "Vendedor",
    email: "ana.paula@empresa.com",
    phone: "(11)95432-1098",
  },
];

export default function CoworkersManagementPage() {
  const navigate = useNavigate();
  const [coworkers, setCoworkers] = useState<Coworker[]>(INITIAL_COWORKERS);
  const [selectedFilter, setSelectedFilter] =
    useState<CoworkerFilter>("Todos os colaboredoes");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [activeCoworker, setActiveCoworker] = useState<Coworker | null>(null);

  useEffect(() => {
    document.title = "Colaboradores | SolarWay";
  }, []);

  const filteredCoworkers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return coworkers.filter((coworker) => {
      const matchesFilter =
        selectedFilter === "Todos os colaboredoes" ||
        (selectedFilter === "Vendedores" && coworker.role === "Vendedor") ||
        (selectedFilter === "Suporte" && coworker.role === "Suporte");

      const matchesSearch =
        !query ||
        coworker.name.toLowerCase().includes(query) ||
        coworker.role.toLowerCase().includes(query) ||
        coworker.email.toLowerCase().includes(query) ||
        coworker.phone.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [coworkers, searchTerm, selectedFilter]);

  const handleDelete = (id: number) => {
    const shouldDelete = window.confirm(
      "Tem certeza que deseja excluir este colaborador?",
    );

    if (!shouldDelete) {
      return;
    }

    setCoworkers((previousState) =>
      previousState.filter((coworker) => coworker.id !== id),
    );
  };

  const modalFooter = (
    <Button
      text="Fechar"
      ariaLabel="Fechar modal"
      onClick={() => setModalMode(null)}
      width="fit-content"
    />
  );

  return (
    <PageLayout
      title="Colaboradores"
      topLeftActions={<BackButton onClick={() => navigate("/configuracoes")} />}
      rightActions={
        <Button
          icon={<FontAwesomeIcon icon={faPlus} />}
          text="Adicionar colaborador"
          ariaLabel="Adicionar colaborador"
          onClick={() => {
            setActiveCoworker(null);
            setModalMode("add");
          }}
          width="fit-content"
        />
      }
    >
      <FilterBar>
        <div style={{ display: "flex", gap: "1rem", width: "100%" }}>
          <SimpleButton
            icon={<FontAwesomeIcon icon={faFilter} />}
            text="Filtros"
            ariaLabel="Filtrar colaboradores"
            onClick={() => null}
          />

          <div className={clientStyles.dropdown} style={{ width: "200px" }}>
            <Select
              value={selectedFilter}
              onChange={(value) => setSelectedFilter(value as CoworkerFilter)}
            >
              <SelectOption value="Todos os colaboredoes" label="Todos" />
              <SelectOption value="Vendedores" label="Vendedores" />
              <SelectOption value="Suporte" label="Suporte" />
            </Select>
          </div>

          <div className={clientStyles.searchBox}>
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Buscar por nome, e-mail ou telefone"
            />
          </div>
        </div>
      </FilterBar>

      <div className={styles.coworkersTable}>
        <Table
          headers={[
            "COLABORADOR",
            "CARGO",
            "E-MAIL",
            "TELEFONE",
            "OPERAÇÃO",
          ]}
          isEmpty={filteredCoworkers.length === 0}
          emptyMessage="Nenhum colaborador encontrado."
        >
          {filteredCoworkers.map((coworker) => (
            <tr key={coworker.id}>
              <td>{coworker.name}</td>
              <td>{coworker.role}</td>
              <td>
                <a
                  href={`mailto:${coworker.email}`}
                  className={
                    coworker.name === "João Silva"
                      ? styles.highlightedMailLink
                      : styles.mailLink
                  }
                >
                  {coworker.email}
                </a>
              </td>
              <td>{coworker.phone}</td>
              <td>
                <div className={clientStyles.actions}>
                  <IconButton
                    onClick={() => {
                      setActiveCoworker(coworker);
                      setModalMode("edit");
                    }}
                    icon={<FontAwesomeIcon icon={faPen} />}
                    ariaLabel="Editar colaborador"
                    functionality="edit"
                  />
                  <IconButton
                    onClick={() => handleDelete(coworker.id)}
                    icon={<FontAwesomeIcon icon={faTrashCan} />}
                    ariaLabel="Excluir colaborador"
                    functionality="delete"
                  />
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </div>

      <Modal
        isOpen={modalMode !== null}
        onClose={() => setModalMode(null)}
        title={modalMode === "add" ? "Adicionar Colaborador" : "Editar Colaborador"}
        footer={modalFooter}
        maxWidth="520px"
      >
        {modalMode === "add" ? (
          <p>
            Placeholder para formulário de cadastro de colaborador.
          </p>
        ) : (
          <div className={styles.modalDetails}>
            <p>
              <strong>Nome:</strong> {activeCoworker?.name}
            </p>
            <p>
              <strong>Cargo:</strong> {activeCoworker?.role}
            </p>
            <p>
              <strong>Email:</strong> {activeCoworker?.email}
            </p>
            <p>
              <strong>Telefone:</strong> {activeCoworker?.phone}
            </p>
          </div>
        )}
      </Modal>
    </PageLayout>
  );
}
