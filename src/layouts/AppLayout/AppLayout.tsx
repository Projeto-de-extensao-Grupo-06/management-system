import {
  faChartLine,
  faCalendar,
  faClipboard,
  faPeopleGroup,
  faGear,
  faWrench,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import VLibras from "@moreiraste/react-vlibras";
import { NavLink, useNavigate } from "react-router";
import { Outlet } from "react-router";

import logo from "../../assets/logo-solarize.png";
import authService from "../../services/LoginService";

import styles from "./AppLayout.module.css";


export default function AppLayout() {
  const menuItems = [
    { to: "/agenda", label: "Agenda", icon: faCalendar },
    { to: "/projetos", label: "Projetos", icon: faClipboard },
    { to: "/clientes", label: "Clientes", icon: faPeopleGroup },
    { to: "/materiais", label: "Materiais", icon: faWrench },
    { to: "/analise", label: "Análises", icon: faChartLine },
    { to: "/configuracoes", label: "Configurações", icon: faGear },
  ];
  const navigate = useNavigate();

  const handleLogout = () => {
    const auth = new authService();
    auth
      .logout()
      .then(() => {
        console.log("Usuário deslogado com sucesso!");
        navigate("/login");
      })
      .catch((e) => {
        console.error("Erro ao fazer logout:", e);
      });
  };

  const menu = menuItems.map((item) => {
    const Icon = item.icon;
    return (
      <li key={item.to} className={styles.menuItem}>
        <NavLink
          to={item.to}
          className={({ isActive }) =>
            `${styles.menuLink} ${isActive ? styles.menuLinkActive : ""}`
          }
        >
          <FontAwesomeIcon className={styles.menuIcon} icon={Icon} />
          <span className={styles.menuText}>{item.label}</span>
        </NavLink>
      </li>
    );
  });

  return (
    <div className={styles.container}>
      <VLibras forceOnload={true} />
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <div className={styles.logoImage}>
            <img src={logo} alt="Solarize Logo" />
          </div>
        </div>

        <nav className={styles.nav}>
          <ul className={styles.menu}>{menu}</ul>
        </nav>

        <div className={styles.logout}>
          <button onClick={handleLogout} className={styles.menuLink}>
            <FontAwesomeIcon
              className={styles.menuIcon}
              icon={faArrowRightFromBracket}
            />
            <span className={styles.menuText}>Sair</span>
          </button>
        </div>
      </aside>

      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}
