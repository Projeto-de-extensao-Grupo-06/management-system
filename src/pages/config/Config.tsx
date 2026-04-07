import {
  faUsers,
  faCog,
  faBell,
  faUser,
  faCalculator,
  faFolder,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import PageLayout from "../../components/layout/PageLayout";
import { SearchInput } from "../../components/ui/Form";
import clientStyles from "../clients/Clients.module.css";
import styles from "./Config.module.css";

export default function Config() {

  useEffect(() => {
  document.title = "Configurações | SolarWay";
}, []);

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const configOptions = [
    {
      id: 1,
      title: "Automações e Notificações",
      description: "Configure processos automáticos e alertas",
      icon: faBell,
      path: "/configuracoes/automacoes-notificacoes",
    },
    {
      id: 2,
      title: "Parâmetros de Orçamento Automático",
      description: "Defina regras de precificação",
      icon: faCalculator,
      path: "/configuracoes/parametros-orcamento",
    },
    {
      id: 3,
      title: "Colaboradores",
      description: "Gerencie usuários e permissões",
      icon: faUsers,
      path: "/configuracoes/colaboradores",
    },
    {
      id: 4,
      title: "Portfólio",
      description: "Projetos que aparecerão no site institucional",
      icon: faFolder,
      path: "/configuracoes/portfolio",
    },
    {
      id: 5,
      title: "Meu Perfil",
      description: "Edite informações pessoais",
      icon: faUser,
      path: "/configuracoes/configPerfil",
    },
    {
      id: 6,
      title: "Redefinir Senha",
      description: "Altere sua senha de acesso",
      icon: faCog,
      path: "/configuracoes/redefinir-senha",
    },
  ];

  const handleOptionClick = (path: string) => {
    navigate(path);
  };

  const filteredOptions = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return configOptions;
    }

    return configOptions.filter((option) =>
      [option.title, option.description].some((value) =>
        value.toLowerCase().includes(query)
      )
    );
  }, [configOptions, searchTerm]);

  return (
    <PageLayout
      title="Configurações"
      rightActions={
        <div className={clientStyles.searchBox}>
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar configurações"
          />
        </div>
      }
    >
      <div className={styles.configGrid}>
        {filteredOptions.map((option) => (
          <div
            key={option.id}
            className={styles.configCard}
            onClick={() => handleOptionClick(option.path)}
          >
            <div className={styles.cardIcon}>
              <FontAwesomeIcon icon={option.icon} />
            </div>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>{option.title}</h3>
              <p className={styles.cardDescription}>{option.description}</p>
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}