import { forwardRef } from 'react';
import type { ClientDetailsFormProps } from '../../../interfaces/properties/ClientDetails';
import type { ClientFormRef } from '../../../interfaces/properties/FormProps';
import ClientForm from './ClientForm';
import styles from './ClientForm.module.css';

const ClientDetailsForm = forwardRef<ClientFormRef, ClientDetailsFormProps>(({ projects, onProjectClick, ...clientFormProps }, ref) => {
    return (
        <div className={styles.detailsContainer}>
            <ClientForm ref={ref} {...clientFormProps} />

            <div className={styles.card}>
                <h3 className={styles.sectionTitle}>Projetos:</h3>
                {/* TODO: Implementar listagem de caixas de projetos (Feature futura) */}
                {projects.length === 0 ? (
                    <div className={styles.emptyState}>
                        Nenhum projeto vinculado a este cliente.
                    </div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Nome do Projeto</th>
                                <th>Status</th>
                                <th>Data de Criação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map(project => (
                                <tr key={project.id} onClick={() => onProjectClick(project.id)} className={styles.projectRow}>
                                    <td>
                                        <div className={styles.projectTitle}>
                                            {project.projectTitle}
                                        </div>
                                    </td>
                                    <td>{project.status}</td>
                                    <td>{new Date(project.createdAt).toLocaleDateString('pt-BR')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
});

export default ClientDetailsForm;
