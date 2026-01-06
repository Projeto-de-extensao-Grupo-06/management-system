import type { ReactNode } from 'react';
import styles from '../../pages/Clients/Clients.module.css'; // Reusing for consistency, ideally extract common layout styles

interface PageHeaderProps {
    title: string;
    count?: number;
    children?: ReactNode;
}

export default function PageHeader({ title, count, children }: PageHeaderProps) {
    return (
        <div className={styles.header}>
            <h1 className={styles.title}>
                {title} {count !== undefined && <span className={styles.count}>({count})</span>}
            </h1>
            {children}
        </div>
    );
}
