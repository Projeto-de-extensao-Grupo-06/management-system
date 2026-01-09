import type { ReactNode } from 'react';
import styles from './Table.module.css';

interface TableProps {
    headers: string[];
    children: ReactNode;
    isEmpty?: boolean;
    emptyMessage?: string;
    className?: string;
}

export default function Table({
    headers,
    children,
    isEmpty = false,
    emptyMessage = "Nenhum registro encontrado.",
    className = ""
}: TableProps) {
    if (isEmpty) {
        return (
            <div className={`${styles.tableWrapper} ${styles.card} ${className}`}>
                <div className={styles.noResultState}>
                    {emptyMessage}
                </div>
            </div>
        );
    }

    return (
        <div className={`${styles.tableWrapper} ${styles.card} ${className}`}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {children}
                </tbody>
            </table>
        </div>
    );
}
