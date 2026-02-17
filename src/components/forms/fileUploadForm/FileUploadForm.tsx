import { useRef } from "react";
import "./FileUploadForm.css";
import type { FileUploadFormProps } from "../../../interfaces/properties/FileUploadFormProps";
import { Button } from "../../ui/Form";


export default function FileUploadForm({ isHomologation, setSelectedFile, setIsHomologation, handleUpload, fileName, setFileName }: FileUploadFormProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    function handleClick() {
        fileInputRef.current?.click();
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setFileName(file.name);
        }
    }

    return (
        <div className="upload-wrapper">
            <label className="upload-label">Entrada de Arquivo</label>

            <div className="upload-container" onClick={handleClick}>
                <span className="upload-button">Escolher arquivo</span>
                <span className="upload-filename">
                    {fileName || "Nenhum arquivo selecionado"}
                </span>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                className="hidden-input"
                onChange={handleChange}
            />

            <div className="checkbox-container">
                <input
                    type="checkbox"
                    id="homologation"
                    checked={isHomologation}
                    onChange={(e) => setIsHomologation(e.target.checked)}
                />
                <label htmlFor="homologation">
                    Documento de homologação
                </label>
            </div>

            <Button
                text="Realizar Upload"
                className="confirm-button"
                onClick={handleUpload}
            />
        </div>
    );
}
