import type { CSSProperties, ReactNode } from "react";
import { BackButton } from '../ui/Form';
import styles from "./PageLayout.module.css";

interface PageLayoutProps {
    title: string;
    backButton?: boolean;
    topLeftActions?: ReactNode;
    titleAccessory?: ReactNode;
    leftActions?: ReactNode;
    rightActions?: ReactNode;
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
}

export default function PageLayout({
    title,
    backButton,
    topLeftActions,
    titleAccessory,
    leftActions,
    rightActions,
    children,
    className = "",
    style
}: PageLayoutProps) {
    return (
        <div className={`${styles.pageContainer} ${className}`.trim()} style={style}>
            <div className={styles.pageHeader}>
                {backButton && (
                    <div className={styles.backButtonWrapper}>
                        <BackButton />
                    </div>
                )}
                {topLeftActions && (
                    <div className={styles.topLeftActionsWrapper}>
                        {topLeftActions}
                    </div>
                )}
                <div className={styles.headerMain}>
                    <div className={styles.headerLeft}>
                        <h1 className={styles.pageTitle}>
                            {title}
                            {titleAccessory && <div className={styles.titleAccessory}>{titleAccessory}</div>}
                        </h1>
                        {leftActions && <div className={styles.leftActionsWrapper}>{leftActions}</div>}
                    </div>
                    {rightActions && <div className={styles.headerRight}>{rightActions}</div>}
                </div>
            </div>
            <div className={styles.pageContent}>
                {children}
            </div>
        </div>
    );
}
