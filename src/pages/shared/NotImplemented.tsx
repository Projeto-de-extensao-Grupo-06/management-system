import { useNavigate } from 'react-router';
import { Button } from '../../components/ui/Form';
import styles from './NotImplemented.module.css';

export default function NotImplemented() {
    const navigate = useNavigate();

    return (
        <div className={styles.content}>
            <h1 className={styles.errorCode}>501</h1>
            <h2 className={styles.title}>Ops... Funcionalidade Não Implementada!</h2>
            <p className={styles.description}>
                A funcionalidade que você está tentando acessar ainda não foi implementada.
            </p>

            <Button text="Voltar para a página anterior" onClick={() => navigate(-1)} />
        </div>
    );
}