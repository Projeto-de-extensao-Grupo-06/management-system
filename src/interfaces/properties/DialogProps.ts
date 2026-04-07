import type { ReactNode } from 'react';

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    footer?: ReactNode;
    maxWidth?: string;
}

export interface ModalRef {
    scrollToTop: () => void;
}

export interface ClientFilterState {
    startDate: string;
    endDate: string;
    city: string;
    state: string;
}

export interface ClientFilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    filters: ClientFilterState;
    onApply: (filters: ClientFilterState) => void;
    onClear: () => void;
}

export interface BudgetParameterFilterState {
    isPreBudget: string;
    status: string;
}

export interface BudgetParameterFilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    filters: BudgetParameterFilterState;
    onApply: (filters: BudgetParameterFilterState) => void;
    onClear: () => void;
}