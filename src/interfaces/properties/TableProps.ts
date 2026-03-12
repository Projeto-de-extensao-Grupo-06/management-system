import type Client from '../types/Client';
import type { Material } from '../types/Material';

export interface ClientTableProps {
    clients: Client[];
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    onRowClick?: (id: number) => void;
}

export interface MaterialTableProps {
    materials: (Material & { linksCount?: number })[];
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
    headers: React.ReactNode[];
    children?: React.ReactNode;
    isEmpty?: boolean;
    emptyMessage?: string;
    className?: string;
}
