import type { FilterBarProps } from '../../interfaces/properties/LayoutProps';
import styles from '../../pages/clients/Clients.module.css'; // Reusing styles

export default function FilterBar({ children }: FilterBarProps) {
    return (
        <div className={`${styles.filters} ${styles.card}`}>
            {children}
        </div>
    );
}
