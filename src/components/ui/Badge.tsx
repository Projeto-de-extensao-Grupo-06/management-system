import React from 'react';
import styles from './Badge.module.css';

export type BadgeVariant =
    | 'new'
    | 'pre_budget'
    | 'client_awaiting_contact'
    | 'awaiting_retry'
    | 'retrying'
    | 'scheduled_technical_visit'
    | 'technical_visit_completed'
    | 'final_budget'
    | 'awaiting_materials'
    | 'scheduled_installing_visit'
    | 'installed'
    | 'completed'
    | 'negotiation_failed'
    | 'contact_not_requested';

interface BadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    className?: string;
    style?: React.CSSProperties;
}

export default function Badge({
    children,
    variant = 'awaiting_retry',
    className = '',
    style,
}: BadgeProps) {
    const badgeClass = `${styles.badge} ${styles[variant]} ${className}`.trim();

    return (
        <span className={badgeClass} style={style}>
            {children}
        </span>
    );
}
