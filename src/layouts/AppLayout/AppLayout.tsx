import { NavLink } from "react-router";
import styles from "./AppLayout.module.css";
import { Outlet } from "react-router";



export default function AppLayout() {
    const menuItems = [
    { to: '/agenda', label: 'Agenda', icon: Calendar },
    { to: '/projetos', label: 'Projetos', icon: Clipboard },
    { to: '/clientes', label: 'Clientes', icon: Users },
    { to: '/materiais', label: 'Materiais', icon: Wrench },
    { to: '/fornecedores', label: 'Fornecedores', icon: Truck },
    { to: '/analises', label: 'Análises', icon: TrendingUp },
    { to: '/configuracoes', label: 'Configurações', icon: Settings },
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
          <Icon className={styles.menuIcon} size={20} />
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
              src="/path/to/your/logo.png" 
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
            <LogOut className={styles.menuIcon} size={20} />
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