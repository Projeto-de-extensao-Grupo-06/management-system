import type AppLayoutProps from "../../interfaces/properties/AppLayoutProps";
import styles from "./AppLayout.module.css";

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>Menu</aside>

      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
}