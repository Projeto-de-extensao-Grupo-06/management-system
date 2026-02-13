import type Client from '../types/Client';

export interface ClientTableProps {
    clients: Client[];
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    onRowClick?: (id: number) => void;
}

export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export interface TableProps {
    headers: string[];
    children?: React.ReactNode;
    isEmpty?: boolean;
    emptyMessage?: string;
    className?: string;
}
