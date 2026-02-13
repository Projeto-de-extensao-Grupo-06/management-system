import type { AlertProps } from '../../interfaces/properties/UIProps';
import styles from './Alert.module.css';

export function Alert({ message, type = 'error' }: AlertProps) {
    if (!message) return null;

    return (
        <div className={`${styles.alert} ${styles[type]}`}>
            {message}
        </div>
    );
}
