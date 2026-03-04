import {
  faChartLine,
  faCalendar,
  faClipboard,
  faPeopleGroup,
  faGear,
  faWrench,
  faArrowRightFromBracket,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import VLibras from "@moreiraste/react-vlibras";
import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import { Outlet } from "react-router";

import logo from "../../assets/logo-SolarWay.png";
import authService from "../../services/AuthService";

import useAuthStore from "../../store/useAuthStore";
import styles from "./AppLayout.module.css";


export default function AppLayout() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const menuItems = [
    { to: "/agenda", label: "Agenda", icon: faCalendar },
    { to: "/projetos", label: "Projetos", icon: faClipboard },
    { to: "/clientes", label: "Clientes", icon: faPeopleGroup },
    { to: "/materiais", label: "Materiais", icon: faWrench },
    { to: "/analise", label: "Análises", icon: faChartLine },
    { to: "/configuracoes", label: "Configurações", icon: faGear },
  ];
  const navigate = useNavigate();
  const { clearUser, checkAuth } = useAuthStore();

  const handleLogout = () => {
    const auth = new authService();
    auth
      .logout()
      .then(() => {
        clearUser();
        checkAuth();
        navigate("/login");
      })
      .catch((e) => {
        console.error("Erro ao fazer logout:", e);
      });
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        document.body.style.overflow = "auto";
      } else if (isSidebarExpanded) {
        document.body.style.overflow = "hidden";
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    if (isSidebarExpanded && window.innerWidth <= 1024) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("resize", handleResize);
    };
  }, [isSidebarExpanded]);


  const menu = menuItems.map((item) => {
    const Icon = item.icon;
    return (
      <li key={item.to} className={styles.menuItem}>
        <NavLink
          to={item.to}
          className={({ isActive }) =>
            `${styles.menuLink} ${isActive ? styles.menuLinkActive : ""}`
          }
          onClick={() => {
            if (window.innerWidth <= 1024) setIsSidebarExpanded(false);
          }}
        >
          <FontAwesomeIcon className={styles.menuIcon} icon={Icon} />
          <span className={styles.menuText}>{item.label}</span>
        </NavLink>
      </li>
    );
  });

  return (
    <div className={styles.container}>
      <div className={styles.vlibrasWrapper}>
        <VLibras forceOnload={true} />
      </div>
      {isSidebarExpanded && (
        <div
          className={styles.overlay}
          onClick={() => setIsSidebarExpanded(false)}
          aria-hidden="true"
        />
      )}

      <aside className={`${styles.sidebar} ${isSidebarExpanded ? styles.sidebarExpanded : ''}`}>
        <div className={styles.sidebarHeader}>
          <button
            className={`${styles.toggleButton} ${styles.desktopToggle}`}
            onClick={toggleSidebar}
            aria-label={isSidebarExpanded ? "Fechar menu" : "Abrir menu"}
          >
            <FontAwesomeIcon icon={isSidebarExpanded ? faTimes : faBars} />
          </button>

          <div className={styles.logo}>
            <div className={styles.logoImage}>
              <img src={logo} alt="SolarWay Logo" />
            </div>
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

      <button
        className={`${styles.toggleButton} ${styles.mobileToggle}`}
        onClick={toggleSidebar}
        aria-label={isSidebarExpanded ? "Fechar menu" : "Abrir menu"}
      >
        <FontAwesomeIcon icon={isSidebarExpanded ? faTimes : faBars} />
      </button>

      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}
