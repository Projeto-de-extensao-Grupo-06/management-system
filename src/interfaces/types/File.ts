import type { Coworker } from "./Coworker";

export interface ProjectFile {
    id: number;
    originalFilename: string;
    mbSize: number;
    homologationDoc: boolean;
    createdAt: string;
    uploader: Coworker
}