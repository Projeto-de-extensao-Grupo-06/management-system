import { faWarning } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from "clsx";
import type { ActionRequiredProps } from '../../interfaces/properties/ActionRequiredProps';
import styles from "./ActionRequired.module.css";

export default function ActionRequired({ projectStatus, clientName }: ActionRequiredProps) {
    const message = (() => {
        if (projectStatus === "CLIENT_AWAITING_CONTACT") {
            return `${clientName} está aguardando seu contato.`;
        }

        if (projectStatus === "RETRYING") {
            return `Seu ultimo contato com ${clientName} não obteve sucesso na negociação. Deseja tentar novamente?`;
        }

        return null;
    })();

    if (message) {
        return (
            <div className={styles.content}>
                <div className={styles.container}>
                    <div className={styles.warningContent}>
                        <FontAwesomeIcon icon={faWarning} color='#DD7428' size='xl'></FontAwesomeIcon>
                        <div className={styles.messageContent}>
                            <h4>Ação necessária</h4>
                            <p>{message}</p>
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <button className={clsx(styles.actionButton, styles.contactButton)}>Contatar</button>
                        <button className={clsx(styles.actionButton, styles.laterButton)}>Mais tarde</button>
                        <button className={clsx(styles.actionButton, styles.ignoreButton)}>Dispensar</button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}