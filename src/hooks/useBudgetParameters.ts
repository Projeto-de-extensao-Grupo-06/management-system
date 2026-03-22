import { useState } from 'react';
import type BudgetParameter from '../interfaces/types/BudgetParameter';

export default function useBudgetParameters() {
    const [parameters] = useState<BudgetParameter[]>([
    {
        id: 1,
        name: 'Tipo de Telhado',
        description: 'Define o material do telhado',
        metric: 'un',
        is_pre_budget: true,
        fixed_value: 0,
        status: 'ATIVO',
        options: [
            { id: 1, type: 'Cerâmico', addition_tax: 0.08, fixed_cost: 500 },
            { id: 2, type: 'Metálico', addition_tax: 0.12, fixed_cost: 800 },
        ],
    },
    {
        id: 2,
        name: 'Mão de Obra',
        description: 'Custo por hora de mão de obra',
        metric: 'R$/h',
        is_pre_budget: false,
        fixed_value: 150,
        status: 'ATIVO',
    },
    {
        id: 3,
        name: 'Deslocamento',
        description: 'Custo de deslocamento da equipe',
        metric: 'km',
        is_pre_budget: false,
        fixed_value: 2.5,
        status: 'INATIVO',
    },
]);
    const [page, setPage] = useState(0);
    const [totalPages] = useState(0);
    const [totalElements] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('Todos');
    const [statusFilter, setStatusFilter] = useState('Todos');

    const handleSearchChange = (term: string) => {
        setSearchTerm(term);
        setPage(0);
    };

    const handleTypeChange = (value: string) => {
        setTypeFilter(value);
        setPage(0);
    };

    const handleStatusChange = (value: string) => {
        setStatusFilter(value);
        setPage(0);
    };

    return {
        parameters,
        page,
        totalPages,
        totalElements,
        searchTerm,
        typeFilter,
        statusFilter,
        setPage,
        handleSearchChange,
        handleTypeChange,
        handleStatusChange,
    };
}