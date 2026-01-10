import { useNavigate } from 'react-router';
import { Button } from '../../components/ui/Form';
import styles from './NotFound.module.css';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className={styles.content}>
            <h1 className={styles.errorCode}>404</h1>
            <h2 className={styles.title}>Ops... Página Não Encontrada!</h2>
            <p className={styles.description}>
                Parece que a página que você está procurando não existe ou foi movida para outro lugar.
            </p>

            <Button text='Voltar' onClick={() => navigate(-1)} />
        </div>
    );
}