import type { PageHeaderProps } from '../../interfaces/properties/LayoutProps';
import styles from '../../pages/clients/Clients.module.css'; // Reusing for consistency, ideally extract common layout styles

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
