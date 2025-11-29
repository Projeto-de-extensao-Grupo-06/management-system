import { NavLink } from "react-router";
import styles from "./AppLayout.module.css";
import { Outlet } from "react-router";

import logo from '../../assets/logo-solarize.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faCalendar, faClipboard, faPeopleGroup, faGear, faWrench, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';

export default function AppLayout() {
  const menuItems = [
    { to: '/agenda', label: 'Agenda', icon: faCalendar },
    { to: '/projetos', label: 'Projetos', icon: faClipboard },
    { to: '/clientes', label: 'Clientes', icon: faPeopleGroup },
    { to: '/materiais', label: 'Materiais', icon: faWrench },
    { to: '/analise', label: 'Análises', icon: faChartLine },
    { to: '/configuracoes', label: 'Configurações', icon: faGear },
  ];

  const handleLogout = () => {
    alert('Logout clicked');
  };

  const menu = menuItems
  .map((item) => {
    const Icon = item.icon;
    return (
      <li key={item.to} className={styles.menuItem}>
        <NavLink 
          to={item.to} 
          className={({ isActive }) => 
            `${styles.menuLink} ${isActive ? styles.menuLinkActive : ''}`
          }>
          <FontAwesomeIcon className={styles.menuIcon} icon={Icon} />
          <span className={styles.menuText}>{item.label}</span>
        </NavLink>
      </li>
    );
  });

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <div className={styles.logoImage}>
            <img 
              src={logo} 
              alt="Solarize Logo"
            />
          </div>
        </div>

        {/* MENU NAVIGATION */}
        <nav className={styles.nav}>
          <ul className={styles.menu}>
            {menu}
          </ul>
        </nav>

    
        <div className={styles.logout}>
          <button 
            onClick={handleLogout}
            className={styles.menuLink}>
            <FontAwesomeIcon className={styles.menuIcon} icon={faArrowRightFromBracket} />
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