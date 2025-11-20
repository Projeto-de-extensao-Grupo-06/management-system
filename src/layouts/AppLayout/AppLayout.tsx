import { NavLink } from "react-router";
import styles from "./AppLayout.module.css";
import { Outlet } from "react-router";

export default function AppLayout() {
  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <h2>Menu</h2>
        <nav>
          <ul>
            <li>
              <NavLink to="/clients">Clientes</NavLink>
            </li>
            <li>
              <NavLink to="/login">Login</NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}