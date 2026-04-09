import type { ClientSchemaType } from "../../schemas/clientSchema";
import type { CoworkerSchemaType } from "../../schemas/coworkerSchema";
import type Client from "./Client";
import type { Coworker } from "./Coworker";

export interface ClientFilters {
  startDate: string;
  endDate: string;
  city: string;
  state: string;
}

export interface CoworkerFilters {
  permissionGroup: string;
}

export interface UseClientsReturn {
  clients: Client[];
  page: number;
  totalPages: number;
  totalElements: number;
  searchTerm: string;
  statusFilter: string;
  filters: ClientFilters;
  isLoading: boolean;
  error: string | null;
  setPage: (page: number) => void;
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: string) => void;
  setFilters: (filters: ClientFilters) => void;
  handleSearchChange: (term: string) => void;
  handleStatusChange: (status: string) => void;
  handleApplyFilters: (newFilters: ClientFilters) => void;
  handleClearFilters: () => void;
  createClient: (data: ClientSchemaType) => Promise<void>;
  updateClient: (id: number, data: ClientSchemaType) => Promise<Client>;
  deleteClient: (id: number) => Promise<void>;
}

export interface UseCoworkersReturn {
  coworkers: Coworker[];
  page: number;
  totalPages: number;
  totalElements: number;
  searchTerm: string;
  statusFilter: string;
  filters: CoworkerFilters;
  isLoading: boolean;
  error: string | null;
  setPage: (page: number) => void;
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: string) => void;
  setFilters: (filters: CoworkerFilters) => void;
  handleSearchChange: (term: string) => void;
  handleStatusChange: (status: string) => void;
  handleApplyFilters: (newFilters: CoworkerFilters) => void;
  handleClearFilters: () => void;
  createCoworker: (data: CoworkerSchemaType) => Promise<void>;
  updateCoworker: (id: number, data: CoworkerSchemaType) => Promise<Coworker>;
  deleteCoworker: (id: number) => Promise<void>;
}
