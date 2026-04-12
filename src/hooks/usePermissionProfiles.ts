import type { AxiosError } from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type {PermissionProfile} from '../interfaces/types/PermissionProfile';
import type { Page } from '../interfaces/types/Page';
import type { PermissionProfileSchemaType } from '../schemas/permissionProfileSchema';
import PermissionProfileService from '../services/PermissionProfileService';

export default function usePermissionProfiles() {
    const [profiles, setProfiles] = useState<PermissionProfile[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Todos');
    const [refetchTrigger, setRefetchTrigger] = useState(0);

    const service = useMemo(() => new PermissionProfileService(), []);

    useEffect(() => {
        service
            .getAll(page, 30, searchTerm, statusFilter)
            .then((resData: Page<PermissionProfile>) => {
                const data = resData as any;
                const pageMeta = data.page || data;

                const totalElementsCount =
                    pageMeta.totalElements ?? data.totalElements ?? 0;

                const totalPagesCount =
                    pageMeta.totalPages ?? data.totalPages ?? 0;

                setProfiles(data.content || []);
                setTotalPages(totalPagesCount);
                setTotalElements(totalElementsCount);
            })
            .catch(() => {
                setProfiles([]);
                setTotalPages(0);
                setTotalElements(0);
            });
    }, [service, page, searchTerm, statusFilter, refetchTrigger]);

    const handleSearchChange = useCallback((term: string) => {
        setSearchTerm(term);
        setPage(0);
    }, []);

    const handleStatusChange = useCallback((value: string) => {
        setStatusFilter(value);
        setPage(0);
    }, []);

    const createProfile = useCallback(
        async (data: PermissionProfileSchemaType): Promise<void> => {
            try {
                await service.create(data);
                setRefetchTrigger((prev) => prev + 1);
            } catch (e) {
                const axiosError = e as AxiosError<{ message: string }>;
                throw new Error(
                    axiosError.response?.data?.message ||
                        'Erro ao criar perfil.'
                );
            }
        },
        [service]
    );

    const deleteProfile = useCallback(
        async (id: number): Promise<void> => {
            try {
                await service.delete(id);
                setRefetchTrigger((prev) => prev + 1);
            } catch (e) {
                const axiosError = e as AxiosError<{ message: string }>;
                throw new Error(
                    axiosError.response?.data?.message ||
                        'Erro ao excluir perfil.'
                );
            }
        },
        [service]
    );

    return {
        profiles,
        page,
        totalPages,
        totalElements,
        searchTerm,
        statusFilter,
        setPage,
        handleSearchChange,
        handleStatusChange,
        createProfile,
        deleteProfile,
    };
}