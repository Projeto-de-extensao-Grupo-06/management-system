import { useNavigate } from 'react-router';
import { Button } from '../../components/ui/Form';
import styles from './ServiceUnavailable.module.css';

export default function ServiceUnavailable() {
    const navigate = useNavigate();

    return (
        <div className={styles.content}>
            <h1 className={styles.errorCode}>503</h1>
            <h2 className={styles.title}>Ops... Serviço Indisponível!</h2>
            <p className={styles.description}>
                O serviço que você está tentando acessar está indisponível.
            </p>

            <Button text="Voltar para a página anterior" onClick={() => navigate(-1)} />
        </div>
    );
}