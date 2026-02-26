import { faArrowLeft, faSave, faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import ClientForm from '../../components/forms/client_form/ClientForm';
import ProjectGrid from '../../components/layout/ProjectGrid';
import SecureComponent from '../../components/security/SecureComponent';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Form';
import useClients from '../../hooks/useClients';
import type { ClientFormRef } from '../../interfaces/properties/FormProps';
import type Client from '../../interfaces/types/Client';
import type Project from '../../interfaces/types/Project';
import type ProjectSummary from '../../interfaces/types/ProjectSummary';
import type { ClientSchemaType } from '../../schemas/clientSchema';
import ClientsService from '../../services/ClientsService';
import styles from './Clients.module.css';

export default function ClientDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { updateClient } = useClients();
    const formRef = useRef<ClientFormRef>(null);

    const [isEditing, setIsEditing] = useState(location.state?.edit || false);
    const [client, setClient] = useState<Client | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    const clientsService = useMemo(() => new ClientsService(), []);

    useEffect(() => {
        if (!id) return;
        const clientId = parseInt(id);

        clientsService.getClientById(clientId)
            .then((data) => {
                setClient(data);
            })
            .catch(err => {
                console.error("Error fetching client:", err);
                setAlert({ message: 'Erro ao carregar dados do cliente.', type: 'error' });
            })
            .finally(() => setLoading(false));

        clientsService.getClientProjects(clientId)
            .then((data) => setProjects(data))
            .catch(err => {
                console.error("Error fetching projects:", err);
                setProjects([]);
            });
    }, [id, clientsService]);

    const handleSave = () => {
        formRef.current?.submit();
    };

    const onFormSubmit = (data: ClientSchemaType) => {
        if (!id || !client) return;

        updateClient(parseInt(id), data)
            .then((updated) => {
                setClient(updated);
                setIsEditing(false);
                setAlert({ message: 'Dados salvos com sucesso!', type: 'success' });
                setTimeout(() => setAlert(null), 5000);
            })
            .catch((err: Error) => {
                setAlert({ message: err.message, type: 'error' });
            });
    };

    const projectSummaries: ProjectSummary[] = useMemo(() => {
        return projects.map(project => ({
            id: project.id,
            projectTitle: project.projectTitle,
            status: project.status,
            deadline: null,
            systemType: null,
            responsible: { id: 0, firstName: '', lastName: '' },
            client: client!,
            commentCount: 0,
            fileCount: 0
        }));
    }, [projects, client]);

    if (loading) return <div className={styles.container}>Carregando...</div>;

    const defaultFormValues: Partial<ClientSchemaType> = client ? {
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
        phone: client.phone,
        document: client.documentNumber || '',
        documentType: (client.documentNumber && client.documentNumber.length > 14) ? 'CNPJ' : 'CPF',
        notes: '',
        zipCode: client.mainAddress?.postalCode || '',
        state: client.mainAddress?.state || '',
        city: client.mainAddress?.city || '',
        neighborhood: client.mainAddress?.neighborhood || '',
        street: client.mainAddress?.streetName || '',
        number: client.mainAddress?.number || ''
    } : {};

    return (
        <div className={styles.container}>
            {alert && (
                <div style={{ marginBottom: '1rem' }}>
                    <Alert message={alert.message} type={alert.type} />
                </div>
            )}

            <div className={styles.header}>
                <div>
                    <button onClick={() => navigate(-1)} className={styles.backButton}>
                        <FontAwesomeIcon icon={faArrowLeft} /> Voltar
                    </button>
                    <h1 className={styles.title}>Detalhes do Cliente</h1>
                </div>

                {isEditing ? (
                    <div className={styles.headerActions}>
                        <Button
                            text="Cancelar"
                            width="fit-content"
                            onClick={() => setIsEditing(false)}
                            ariaLabel="Cancelar Edição"
                            className={styles.cancelButton}
                        />
                        <Button
                            text="Salvar Dados"
                            icon={<FontAwesomeIcon icon={faSave} />}
                            onClick={handleSave}
                            width="fit-content"
                            ariaLabel="Salvar Dados"
                        />
                    </div>
                ) : (
                    <SecureComponent permissions={["CLIENT_UPDATE"]}>
                        <Button
                            text="Editar"
                            icon={<FontAwesomeIcon icon={faPen} />}
                            onClick={() => setIsEditing(true)}
                            width="fit-content"
                            ariaLabel="Editar Dados"
                        />
                    </SecureComponent>

                )}
            </div>

            <ClientForm
                ref={formRef}
                onSubmit={onFormSubmit}
                defaultValues={defaultFormValues}
                readOnly={!isEditing}
            />

            <SecureComponent permissions={["PROJECT_READ"]}>
                <div className={`${styles.card} ${styles.projectsSection}`}>
                    <h3 className={styles.sectionTitle}>Projetos:</h3>
                    <ProjectGrid
                        projects={projectSummaries}
                        emptyMessage="Nenhum projeto vinculado a este cliente."
                    />
                </div>
            </SecureComponent>
        </div>
    );
}
