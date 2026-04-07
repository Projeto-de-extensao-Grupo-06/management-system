import { useNavigate } from 'react-router';
import { Button } from '../../components/ui/Form';
import styles from './GatewayTimeout.module.css';

export default function GatewayTimeout() {
    const navigate = useNavigate();

    return (
        <div className={styles.content}>
            <h1 className={styles.errorCode}>504</h1>
            <h2 className={styles.title}>Ops... Gateway Timeout!</h2>
            <p className={styles.description}>
                O gateway que você está tentando acessar demorou muito para responder e atingiu o tempo limite.
            </p>

            <Button text="Voltar para a página anterior" onClick={() => navigate(-1)} />
        </div>
    );
}