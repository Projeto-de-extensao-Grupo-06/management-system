import VLibras from "@moreiraste/react-vlibras";
import type { ReactNode } from 'react';
import logo from '../../assets/logo-SolarWay.png';
import styles from './AuthLayout.module.css';

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
}

export default function AuthLayout({ children, title }: AuthLayoutProps) {
    return (
        <div className={styles.container}>
            <VLibras forceOnload={true} />
            <div className={styles.overlay} />

            <div className={styles.card}>
                <p className={styles.title}>{title}</p>
                <div className={styles.logoContainer}>
                    <img
                        src={logo}
                        alt="SolarWay Energia Solar"
                        className={styles.logo}
                    />
                </div>

                {children}
            </div>
        </div>
    );
}
