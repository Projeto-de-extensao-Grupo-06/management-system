import styles from './Alert.module.css';

interface AlertProps {
    message: string;
    type?: 'error' | 'success' | 'warning';
}

export function Alert({ message, type = 'error' }: AlertProps) {
    if (!message) return null;

    return (
        <div className={`${styles.alert} ${styles[type]}`}>
            {message}
        </div>
    );
}
