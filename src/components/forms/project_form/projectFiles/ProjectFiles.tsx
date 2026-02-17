import { faFile, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import Swal from "sweetalert2"
import type { ProjectFilesProps } from "../../../../interfaces/properties/ProjectFilesProps";
import type { ProjectFile } from "../../../../interfaces/types/File";
import FilesService from "../../../../services/FilesService";
import Modal from "../../../dialogs/modal/Modal";
import SecureComponent from "../../../security/SecureComponent";
import { FileInput } from "../../../ui/Form";
import FileUploadForm from "../../fileUploadForm/FileUploadForm";
import styles from "./ProjectFiles.module.css";

const fileService = new FilesService();

export default function ProjectFiles({ projectId }: ProjectFilesProps) {
    const [files, setFiles] = useState<ProjectFile[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isHomologation, setIsHomologation] = useState(false);
    const [fileName, setFileName] = useState("");


    useEffect(() => {
        const loadFiles = async () => {
            const files = await fileService.listProjectFiles(projectId);

            if (files) {
                setFiles(files);
            }
        };

        loadFiles();
    }, [modalOpen]);

    async function handleDownload(fileId: number) {
        await fileService.downloadFile(projectId, fileId);
    }

    async function handleUpload() {
        if (!selectedFile) {
            await Swal.fire({
                icon: "warning",
                title: "Nenhum arquivo selecionado",
                text: "Selecione um arquivo antes de enviar.",
                confirmButtonColor: "#1e5128"
            });
            return;
        }

        Swal.fire({
            title: "Enviando arquivo...",
            text: "Aguarde enquanto o upload é realizado.",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            await fileService.uploadFile(
                projectId,
                selectedFile,
                isHomologation
            );

            await Swal.fire({
                icon: "success",
                title: "Upload realizado!",
                text: "Arquivo enviado com sucesso.",
                confirmButtonColor: "#1e5128"
            });

            setSelectedFile(null);
            setFileName("");
            setIsHomologation(false);

        } catch (error) {
            console.error(error);

            await Swal.fire({
                icon: "error",
                title: "Erro no upload",
                text: "Não foi possível enviar o arquivo.",
                confirmButtonColor: "#1e5128"
            });
        }
    }

    return (
        <div>
            <div className={styles.infoContainer}>
                <div className={styles.infoIconAndText}>
                    <FontAwesomeIcon icon={faFile} color="black" size="xl" />
                    <span className={styles.infoText}>  Anexos</span>
                </div>
            </div>

            <div className={styles.form}>
                <div className={styles.inputContainer}>
                    {files.map((file, key) => {
                        return <FileInput key={key} fileName={file.originalFilename ?? ""} onDelete={() => { }} onDownload={() => handleDownload(file.id)} />
                    })}

                    <SecureComponent permissions={["PROJECT_UPDATE"]}>
                        <div className={styles.uploadFilesContainer} onClick={() => setModalOpen(true)}>
                            <span className={styles.uploadFiles}>Realizar upload de arquivo</span>
                            <FontAwesomeIcon icon={faPlusCircle} size="lg" />
                        </div>
                    </SecureComponent>

                    <Modal title="Upload de arquivos" isOpen={modalOpen} onClose={() => setModalOpen(false)}>
                        <FileUploadForm
                            fileName={fileName}
                            handleUpload={handleUpload}
                            isHomologation={isHomologation}
                            setIsHomologation={setIsHomologation}
                            setFileName={setFileName}
                            setSelectedFile={setSelectedFile}
                        />
                    </Modal>
                </div>
            </div>
        </div>
    )
}