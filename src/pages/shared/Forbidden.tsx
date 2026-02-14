import styles from './Forbidden.module.css';

export default function Forbidden() {
    return (
        <div className={styles.content}>
            <h1 className={styles.errorCode}>403</h1>
            <h2 className={styles.title}>Quase lá… mas essa área exige permissão</h2>
            <p className={styles.description}>
                Parece que você tentou acessar uma página restrita.
                No momento, seu perfil não possui permissão para visualizar este conteúdo.
                Caso precise de acesso, entre em contato com o administrador do sistema.
            </p>
        </div>
    );
}