import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import type { ModalProps, ModalRef } from '../../../interfaces/properties/DialogProps';
import styles from './Modal.module.css';

const Modal = forwardRef<ModalRef, ModalProps>(({ isOpen, onClose, title, children, footer, maxWidth }, ref) => {
    const contentRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
        scrollToTop: () => {
            contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }));

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div
                className={styles.container}
                style={{ maxWidth: maxWidth }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.header}>
                    <h2 className={styles.title}>{title}</h2>
                    <button
                        className={styles.closeButton}
                        onClick={onClose}
                        aria-label="Fechar modal"
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                <div className={styles.content} ref={contentRef}>
                    {children}
                </div>

                {footer && (
                    <div className={styles.footer}>
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
});

export default Modal;
