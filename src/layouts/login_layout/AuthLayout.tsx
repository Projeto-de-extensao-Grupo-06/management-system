import VLibras from "@moreiraste/react-vlibras";
import { useEffect, useState, type ReactNode } from 'react';
import logo from '../../assets/logo-SolarWay.png';
import type { PortfolioItem } from '../../interfaces/types/Portfolio';
import PortfolioService from '../../services/PortfolioService';
import styles from './AuthLayout.module.css';

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
}

export default function AuthLayout({ children, title }: AuthLayoutProps) {
    const portfolioService = new PortfolioService();
    const [featuredCase, setFeaturedCase] = useState<PortfolioItem | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadFeaturedCase = async () => {
            try {
                const items = await portfolioService.listPublic();
                if (isMounted) {
                    setFeaturedCase(items[0] ?? null);
                }
            } catch {
                if (isMounted) {
                    setFeaturedCase(null);
                }
            }
        };

        void loadFeaturedCase();

        const handlePortfolioUpdate = () => {
            void loadFeaturedCase();
        };

        window.addEventListener('portfolio-updated', handlePortfolioUpdate);

        return () => {
            isMounted = false;
            window.removeEventListener('portfolio-updated', handlePortfolioUpdate);
        };
    }, []);

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

                {featuredCase && (
                    <div className={styles.featuredCase}>
                        <div
                            className={styles.featuredImage}
                            style={{ backgroundImage: `url(${featuredCase.images[0]?.src ?? ''})` }}
                        >
                            {!featuredCase.images[0]?.src && <span>Case em destaque</span>}
                        </div>
                        <div className={styles.featuredCopy}>
                            <span className={styles.featuredLabel}>Portfólio institucional</span>
                            <strong>{featuredCase.title}</strong>
                            <p>{featuredCase.location || 'Local não informado'}</p>
                        </div>
                    </div>
                )}

                {children}
            </div>
        </div>
    );
}
