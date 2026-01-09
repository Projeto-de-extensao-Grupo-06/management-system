import type { ReactNode } from 'react';
import styles from '../../pages/clients/Clients.module.css'; // Reusing styles

interface FilterBarProps {
    children: ReactNode;
}

export default function FilterBar({ children }: FilterBarProps) {
    return (
        <div className={`${styles.filters} ${styles.card}`}>
            {children}
        </div>
    );
}
