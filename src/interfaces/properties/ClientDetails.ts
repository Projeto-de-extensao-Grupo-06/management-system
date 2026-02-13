import type Project from "../types/Project";
import type { ClientFormProps } from "./FormProps";

export interface ClientDetailsFormProps extends ClientFormProps {
    projects: Project[];
    onProjectClick: (projectId: number) => void;
}