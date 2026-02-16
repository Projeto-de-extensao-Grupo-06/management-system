import { faFile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input } from "../../../ui/Form";
import styles from "./ProjectFiles.module.css";

export default function ProjectFiles() {
    return (
        <div>
            <div className={styles.infoContainer}>
                <div className={styles.infoIconAndText}>
                    <FontAwesomeIcon icon={faFile} color="black" size="xl" />
                    <span className={styles.infoText}>  Arquivos</span>
                </div>
                <span className={styles.uploadFiles}>Realizar upload de arquivo</span>
            </div>

            <div className={styles.form}>
                <div className={styles.inputContainer}>
                    <label className={styles.inputLabel}>Nome do projeto:</label>
                    <Input disabled={true} value="Teste" />
                </div>
            </div>
        </div>
    )
}