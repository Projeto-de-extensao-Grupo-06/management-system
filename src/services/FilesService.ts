import type { ProjectFile } from '../interfaces/types/File';
import api from './provider/api';
  
export default class FilesService {
  async listProjectFiles(projectId: number): Promise<ProjectFile[] | null> {
    const res = await api.get<ProjectFile[]>(`/projects/${projectId}/files`);
    return res.data;
  }

  async downloadFile(projectId: number, fileId: number): Promise<void> {
    const response = await api.get(
      `/projects/${projectId}/files/${fileId}/download`,
      {
        responseType: "blob",
      }
    );
    const contentDisposition = response.headers["content-disposition"];

    let fileName = "download";

    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?(.+?)"?$/);
      if (match?.[1]) {
        fileName = match[1];
      }
    }

    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();

    window.URL.revokeObjectURL(url);
  }


async uploadFile(
  projectId: number,
  file: File,
  isHomologation: boolean
): Promise<void> {

  const formData = new FormData();

  formData.append("files", file);
  formData.append("isHomologation", String(isHomologation));

  await api.post(
    `/projects/${projectId}/files`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
}

};