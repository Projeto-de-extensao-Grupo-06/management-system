import { useEffect, useMemo, useState } from "react";
import { useCallback } from "react";
import type {
  CoworkerFilters,
  UseCoworkersReturn,
} from "../interfaces/types/HookTypes";
import type { Coworker } from "../interfaces/types/Coworker";
import CoworkerService, {
  type CreateCoworkerPayload,
  type UpdateCoworkerPayload,
} from "../services/CoworkerService";
import type {
  CoworkerEditSchemaType,
  CoworkerSchemaType,
} from "../schemas/coworkerSchema";
import { coworkerEditSchema, coworkerSchema } from "../schemas/coworkerSchema";
import type { AxiosError } from "axios";
import type { Page } from "../interfaces/types/Page";

const isCoworkerPageResponse = (
  data: Page<Coworker> | Coworker[],
): data is Page<Coworker> => {
  return !Array.isArray(data) && Array.isArray(data.content);
};

const normalizeText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

const matchesCoworkerSearch = (coworker: Coworker, searchTerm: string) => {
  const normalizedSearch = normalizeText(searchTerm);

  if (!normalizedSearch) {
    return true;
  }

  const searchableFields = [
    `${coworker.firstName} ${coworker.lastName}`,
    coworker.firstName,
    coworker.lastName,
    coworker.email,
  ];

  return searchableFields.some((field) =>
    normalizeText(field ?? "").includes(normalizedSearch),
  );
};

const matchesPermissionGroupFilter = (
  coworker: Coworker,
  permissionGroup: string,
) => {
  if (!permissionGroup || permissionGroup === "Todos") {
    return true;
  }

  const normalizedCoworkerRole = normalizeText(
    coworker.permissionGroupRole ?? "",
  );
  const normalizedFilter = normalizeText(permissionGroup);

  const roleAliases: Record<string, string[]> = {
    admin: ["admin", "administrador", "role_admin"],
    tecnico: [
      "tecnico",
      "tecnico instalador",
      "técnico",
      "técnico instalador",
    ],
    secretaria: ["secretaria", "secretária"],
  };

  const acceptedRoles = roleAliases[normalizedFilter] ?? [normalizedFilter];

  return acceptedRoles.includes(normalizedCoworkerRole);
};

const permissionGroupMap: Record<string, number> = {
  admin: 1,
  tecnico: 2,
  "tecnico instalador": 2,
  técnico: 2,
  "técnico instalador": 2,
  secretaria: 3,
  secretária: 3,
};

export default function useCoworkers(): UseCoworkersReturn {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Ativo");
  const [coworkers, setCoworkers] = useState<Coworker[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [filters, setFilters] = useState<CoworkerFilters>({
    permissionGroup: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const coworkerService = useMemo(() => new CoworkerService(), []);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    coworkerService
      .getAllCoworkers(page, 30, searchTerm, statusFilter)
      .then((resData: Page<Coworker> | Coworker[]) => {
        if (Array.isArray(resData)) {
          const filteredCoworkers = resData.filter((coworker) =>
            matchesPermissionGroupFilter(coworker, filters.permissionGroup)
          );

          setCoworkers(filteredCoworkers);
          setTotalElements(filteredCoworkers.length);
          setTotalPages(1);
          return;
        }

        if (isCoworkerPageResponse(resData)) {
          const data = resData as any;
          const pageMeta = data.page || data;

          const totalElementsCount =
            pageMeta.totalElements ?? data.totalElements ?? 0;
          const totalPagesCount =
            pageMeta.totalPages ??
            data.totalPages ??
            Math.ceil(
              totalElementsCount /
                (pageMeta.size ?? data.pageable?.pageSize ?? 20),
            );

          const filteredCoworkers = (data.content || []).filter(
            (coworker: Coworker) =>
              matchesPermissionGroupFilter(coworker, filters.permissionGroup)
          );

          setCoworkers(filteredCoworkers);
          setTotalPages(totalPagesCount);
          setTotalElements(filteredCoworkers.length);
          return;
        }

        setCoworkers([]);
        setTotalPages(0);
        setTotalElements(0);
      })
      .catch(() => {
        setError("Erro ao carregar colaboradores.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [
    coworkerService,
    page,
    searchTerm,
    statusFilter,
    filters,
    refetchTrigger,
  ]);

  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
    setPage(0);
  }, []);

  const handleStatusChange = useCallback((status: string) => {
    setStatusFilter(status);
    setPage(0);
  }, []);

  const handleApplyFilters = useCallback((newFilters: CoworkerFilters) => {
    setFilters(newFilters);
    setPage(0);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      permissionGroup: "Todos",
    });
    setPage(0);
  }, []);

  const createCoworker = useCallback(
    async (data: CoworkerSchemaType): Promise<void> => {
      try {
        const validatedData = coworkerSchema.parse(data);
        const permissionGroupId =
          permissionGroupMap[normalizeText(validatedData.permissionGroupRole)];

        if (!permissionGroupId) {
          throw new Error("Perfil de permissão inválido.");
        }

        const coworkerPayload: CreateCoworkerPayload = {
          firstName: validatedData.firstName.trim(),
          lastName: validatedData.secondName.trim(),
          email: validatedData.email.trim(),
          phone: validatedData.phone.replace(/\D/g, ""),
          password: validatedData.password,
          permissionGroupId,
        };

        await coworkerService.createCoworker(coworkerPayload);
        setRefetchTrigger((prev) => prev + 1);
      } catch (e) {
        if (e instanceof Error && e.message === "Perfil de permissão inválido.") {
          throw e;
        }

        const axiosError = e as AxiosError<{
          message: string;
          validationErrors?: { field: string; message: string }[];
          errors?: string[];
        }>;
        let errorMsg = "";

        if (axiosError.response?.status === 409) {
          const responseData = axiosError.response.data;
          const message = responseData?.message || "";

          let duplicateField = "";
          if (message.toLowerCase().includes("email")) {
            duplicateField = "E-mail";
          }

          if (message.toLowerCase().includes("phone")) {
            duplicateField = "Telefone";
          }

          if (duplicateField) {
            errorMsg = `${duplicateField} já está cadastrado no sistema. Verifique os dados e tente novamente.`;
          } else {
            errorMsg =
              message ||
              "Este colaborador já existe no sistema. Verifique os dados.";
          }
        } else {
          errorMsg =
            "Não foi possível criar o colaborador. Revise os campos obrigatórios e tente novamente.";
        }

        throw new Error(errorMsg);
      }
    },
    [coworkerService],
  );

  const deleteCoworker = useCallback(
    async (id: number): Promise<void> => {
      try {
        await coworkerService.deleteCoworker(id);
        setRefetchTrigger((prev) => prev + 1);
      } catch (e) {
        const axiosError = e as AxiosError<{ message: string }>;
        const errorMessage =
          axiosError.response?.data?.message ||
          "Erro ao deletar colaborador. Tente novamente";
        throw new Error(errorMessage);
      }
    },
    [coworkerService],
  );

  const updateCoworker = useCallback(
    async (id: number, data: CoworkerEditSchemaType): Promise<Coworker> => {
      try {
        const validatedData = coworkerEditSchema.parse(data);
        const permissionGroupId =
          permissionGroupMap[normalizeText(validatedData.permissionGroupRole)];

        if (!permissionGroupId) {
          throw new Error("Perfil de permissão inválido.");
        }

        const coworkerPayLoad: UpdateCoworkerPayload = {
          firstName: validatedData.firstName.trim(),
          lastName: validatedData.secondName.trim(),
          email: validatedData.email.trim(),
          phone: validatedData.phone.replace(/\D/g, ""),
          permissionGroupId,
        };

        const res = await coworkerService.updateCoworker(id, coworkerPayLoad);
        setRefetchTrigger((prev) => prev + 1);
        return res;
      } catch (e) {
        if (e instanceof Error && e.message === "Perfil de permissão inválido.") {
          throw e;
        }

        const axiosError = e as AxiosError<{
          message: string;
          validationErrors?: { field: string; message: string }[];
          errors?: string[];
        }>;

        let errorMsg = "";

        if (axiosError.response?.status === 409) {
          const responseData = axiosError.response.data;
          const message = responseData?.message || "";

          let duplicateField = "";
          if (message.toLowerCase().includes("email")) {
            duplicateField = "E-mail";
          }

          if (message.toLowerCase().includes("phone")) {
            duplicateField = "Telefone";
          }

          if (duplicateField) {
            errorMsg = `${duplicateField} já está cadastrado no sistema. Verifique os dados e tente novamente.`;
          } else {
            errorMsg =
              message ||
              "Este colaborador já existe no sistema. Verifique os dados.";
          }
        } else {
          errorMsg =
            "Não foi possível atualizar o colaborador. Revise os campos obrigatórios e tente novamente.";
        }

        throw new Error(errorMsg);
      }
    },
    [coworkerService],
  );

  return {
    coworkers,
    page,
    totalPages,
    totalElements,
    searchTerm,
    isLoading,
    error,
    setPage,
    filters,
    statusFilter,
    setSearchTerm,
    setStatusFilter,
    setFilters,
    handleSearchChange,
    handleStatusChange,
    handleApplyFilters,
    handleClearFilters,
    createCoworker,
    updateCoworker,
    deleteCoworker,
  };
}
