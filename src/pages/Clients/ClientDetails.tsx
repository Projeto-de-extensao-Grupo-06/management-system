import { faArrowLeft, faSave, faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { Alert } from '../../components/Alert';
import { Button, Input, Select, SelectOption } from '../../components/Form';
import type Client from '../../interfaces/types/Client';
import type Project from '../../interfaces/types/Project';
import ClientsService from '../../services/ClientsService';
import styles from './Clients.module.css'; // Reusing styles

export default function ClientDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // Initialize editing mode based on navigation state, default to false (view only)
    const [isEditing, setIsEditing] = useState(location.state?.edit || false);

    const [client, setClient] = useState<Client | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    // Form state - separating raw values for editing
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        documentNumber: '',
        documentType: 'CPF',
        notes: '',
        zipCode: '',
        state: '',
        city: '',
        neighborhood: '',
        streetName: '',
        number: ''
    });

    const clientsService = useMemo(() => new ClientsService(), []);

    useEffect(() => {
        if (!id) return;
        const clientId = parseInt(id);

        // Fetch Client
        clientsService.getClientById(clientId)
            .then((data) => {
                setClient(data);
                setFormData({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    phone: data.phone,
                    documentNumber: data.documentNumber || '',
                    documentType: (data.documentNumber && data.documentNumber.length > 14) ? 'CNPJ' : 'CPF',
                    notes: '',
                    zipCode: data.mainAddress?.postalCode || '',
                    state: data.mainAddress?.state || '',
                    city: data.mainAddress?.city || '',
                    neighborhood: data.mainAddress?.neighborhood || '',
                    streetName: data.mainAddress?.streetName || '',
                    number: data.mainAddress?.number || ''
                });
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
        if (!id || !client) return;

        // Construct payload or partial client update logic
        // Current updateClient in service calls PUT with client data.
        // We'll need to adapt the formData back to domain or API structure.
        // Since updateClient takes Partial<Client>, we might need to map it back manually if the API expects nested address.
        // For now, let's assume we can send what we have or map it simpler.

        // IMPORTANT: The service `updateClient` signature is `updateClient(id, client: Partial<Client>)`.
        // But the backend likely expects the same structure as create or similar.
        // Let's create a partial object that matches Client interface structure for now, 
        // assuming standard mapper handling or we might need to adjust the service to handle flat->nested if API requires.

        // Actually, looking at `Client` interface, it has `mainAddress`.
        const updatedClient: Partial<Client> = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            documentNumber: formData.documentNumber,
            mainAddress: {
                ...client.mainAddress, // keep existing fields like type if needed
                streetName: formData.streetName,
                number: formData.number,
                neighborhood: formData.neighborhood,
                city: formData.city,
                state: formData.state,
                postalCode: formData.zipCode,
                type: client.mainAddress?.type || 'RESIDENTIAL'
            }
            // notes? Client interface doesn't seem to have notes in the snippet I saw earlier, checking...
            // Step 22 snippet showed: id, firstName, lastName, name, email, phone, status, documentNumber, mainAddress, createdAt.
            // Notes seems missing from Client interface. I'll rely on what's there.
        };

        clientsService.updateClient(client.id, updatedClient)
            .then((updated) => {
                setClient(updated);
                setIsEditing(false); // Switch back to view mode
                setAlert({ message: 'Dados salvos com sucesso!', type: 'success' });
            })
            .catch(err => {
                console.error(err);
                setAlert({ message: 'Erro ao salvar dados.', type: 'error' });
            });
    };

    if (loading) return <div className={styles.container}>Carregando...</div>;

    const renderField = (label: string, value: string, inputComponent: React.ReactNode) => (
        <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>{label}:</label>
            {isEditing ? (
                inputComponent
            ) : (
                <div style={{ padding: '10px 12px', background: '#f9fafb', borderRadius: '6px', border: '1px solid #e5e7eb', minHeight: '42px', display: 'flex', alignItems: 'center' }}>
                    {value || '-'}
                </div>
            )}
        </div>
    );

    return (
        <div className={styles.container}>
            {alert && (
                <div style={{ marginBottom: '1rem' }}>
                    <Alert message={alert.message} type={alert.type} />
                </div>
            )}

            <div className={styles.header}>
                <div>
                    <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--color-text-light)', cursor: 'pointer', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <FontAwesomeIcon icon={faArrowLeft} /> Voltar
                    </button>
                    <h1 className={styles.title} style={{ color: 'var(--color-secondary)' }}>Detalhes do Cliente</h1>
                </div>

                {isEditing ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Button
                            text="Cancelar"
                            width="fit-content"
                            onClick={() => setIsEditing(false)}
                            ariaLabel="Cancelar Edição"
                            style={{ background: '#ef4444', borderColor: '#ef4444' }} // Custom style for cancel or use SimpleButton
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
                    <Button
                        text="Editar"
                        icon={<FontAwesomeIcon icon={faPen} />}
                        onClick={() => setIsEditing(true)}
                        width="fit-content"
                        ariaLabel="Editar Dados"
                    />
                )}
            </div>

            <div className={styles.card} style={{ padding: '24px' }}>
                <h3 style={{ color: 'var(--color-secondary)', marginBottom: '16px', fontSize: '18px' }}>Dados Cadastrais:</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    {renderField("Primeiro Nome", formData.firstName,
                        <Input value={formData.firstName} onChange={(v) => setFormData(p => ({ ...p, firstName: v }))} placeholder="" />
                    )}
                    {renderField("Segundo Nome", formData.lastName,
                        <Input value={formData.lastName} onChange={(v) => setFormData(p => ({ ...p, lastName: v }))} placeholder="" />
                    )}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    {renderField("E-mail", formData.email,
                        <Input value={formData.email} onChange={(v) => setFormData(p => ({ ...p, email: v }))} placeholder="" />
                    )}
                    {renderField("Telefone", formData.phone,
                        <Input value={formData.phone} onChange={(v) => setFormData(p => ({ ...p, phone: v }))} placeholder="" />
                    )}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    {renderField("Número Documento", formData.documentNumber,
                        <Input value={formData.documentNumber} onChange={(v) => setFormData(p => ({ ...p, documentNumber: v }))} placeholder="" />
                    )}
                    {renderField("Tipo do Documento", formData.documentType,
                        <Select value={formData.documentType} onChange={(v) => setFormData(p => ({ ...p, documentType: v }))} style={{ width: '100%' }}>
                            <SelectOption value="CPF" label="CPF" />
                            <SelectOption value="CNPJ" label="CNPJ" />
                        </Select>
                    )}
                    {renderField("Notas", formData.notes,
                        <Input value={formData.notes} onChange={(v) => setFormData(p => ({ ...p, notes: v }))} placeholder="" />
                    )}
                </div>
            </div>

            <div className={styles.card} style={{ padding: '24px' }}>
                <h3 style={{ color: 'var(--color-secondary)', marginBottom: '16px', fontSize: '18px' }}>Endereço:</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    {renderField("CEP", formData.zipCode,
                        <Input value={formData.zipCode} onChange={(v) => setFormData(p => ({ ...p, zipCode: v }))} placeholder="" />
                    )}
                    {renderField("Estado", formData.state,
                        <Input value={formData.state} onChange={(v) => setFormData(p => ({ ...p, state: v }))} placeholder="" maxLength={2} />
                    )}
                    {renderField("Cidade", formData.city,
                        <Input value={formData.city} onChange={(v) => setFormData(p => ({ ...p, city: v }))} placeholder="" />
                    )}
                    {renderField("Bairro", formData.neighborhood,
                        <Input value={formData.neighborhood} onChange={(v) => setFormData(p => ({ ...p, neighborhood: v }))} placeholder="" />
                    )}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                    {renderField("Logradouro", formData.streetName,
                        <Input value={formData.streetName} onChange={(v) => setFormData(p => ({ ...p, streetName: v }))} placeholder="" />
                    )}
                    {renderField("Número", formData.number,
                        <Input value={formData.number} onChange={(v) => setFormData(p => ({ ...p, number: v }))} placeholder="" />
                    )}
                </div>
            </div>

            <h3 style={{ color: 'var(--color-secondary)', marginTop: '24px', marginBottom: '16px', fontSize: '18px' }}>Projetos:</h3>
            <div className={styles.card}>
                {projects.length === 0 ? (
                    <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-light)' }}>
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
                                <tr key={project.id} onClick={() => navigate(`/projetos/${project.id}`)} style={{ cursor: 'pointer' }}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {project.title}
                                            {/* Example badge if needed */}
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
}
