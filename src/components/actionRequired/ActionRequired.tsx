import { faWarning } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from "clsx";
import { useEffect, useState } from 'react';
import type { ActionRequiredProps } from '../../interfaces/properties/ActionRequiredProps';
import ClientsService from '../../services/ClientsService';
import styles from "./ActionRequired.module.css";

const clientService = new ClientsService();

export default function ActionRequired({ projectStatus, clientId }: ActionRequiredProps) {
    const [clientName, setClientName] = useState("");

    useEffect(() => {
        const fetchClient = async () => {
            const data = await clientService.getClientById(clientId);

            setClientName(data.firstName);
        }

        fetchClient();
    }, []);

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