import { useNavigate } from 'react-router';
import { Button } from '../../components/ui/Form';
import styles from './BadGateway.module.css';

export default function BadGateway() {
    const navigate = useNavigate();

    return (
        <div className={styles.content}>
            <h1 className={styles.errorCode}>502</h1>
            <h2 className={styles.title}>Ops... Gateway Inválido!</h2>
            <p className={styles.description}>
                O gateway que você está tentando acessar está indisponível.
            </p>

            <Button text="Voltar para a página anterior" onClick={() => navigate(-1)} />
        </div>
    );
}