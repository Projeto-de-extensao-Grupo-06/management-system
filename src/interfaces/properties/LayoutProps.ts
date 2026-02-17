import type { ReactNode } from 'react';

export interface PageHeaderProps {
    title: string;
    count?: number;
    children?: ReactNode;
    titleRight?: ReactNode;
}

export interface FilterBarProps {
    children?: ReactNode;
}
