import { faArrowLeft, faSave, faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { Alert } from '../../components/ui/Alert';
import { Button, Input, Select, SelectOption } from '../../components/ui/Form';
import type Client from '../../interfaces/types/Client';
import type Project from '../../interfaces/types/Project';
import { clientSchema } from '../../schemas/clientSchema';
import AddressService from '../../services/AddressService';
import ClientsService from '../../services/ClientsService';
import styles from './Clients.module.css';

export default function ClientDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [isEditing, setIsEditing] = useState(location.state?.edit || false);

    const [client, setClient] = useState<Client | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

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

    const isAddressFilled = useMemo(() => {
        const { zipCode, state, city, neighborhood, streetName, number } = formData;
        return !!(zipCode || state || city || neighborhood || streetName || number);
    }, [formData]);

    const clientsService = useMemo(() => new ClientsService(), []);
    const addressService = useMemo(() => new AddressService(), []);

    useEffect(() => {
        if (!id) return;
        const clientId = parseInt(id);

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

    // Auto-fill address by CEP
    useEffect(() => {
        if (!isEditing) return;

        const zipCode = formData.zipCode;
        const cleanCep = zipCode?.replace(/\D/g, '');

        if (cleanCep?.length === 8) {
            addressService.getAddressByCep(cleanCep)
                .then((address) => {
                    if (address) {
                        setFormData(prev => ({
                            ...prev,
                            streetName: address.logradouro,
                            neighborhood: address.bairro,
                            city: address.localidade,
                            state: address.uf
                        }));
                    }
                })
                .catch(err => {
                    console.error('Error fetching address:', err);
                });
        }
    }, [formData.zipCode, isEditing, addressService]);

    const handleSave = () => {
        if (!id || !client) return;

        // Map formData to schema expected structure
        const schemaData = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            document: formData.documentNumber, // Map documentNumber -> document
            documentType: formData.documentType as 'CPF' | 'CNPJ',
            notes: formData.notes,
            zipCode: formData.zipCode,
            state: formData.state,
            city: formData.city,
            neighborhood: formData.neighborhood,
            street: formData.streetName, // Map streetName -> street
            number: formData.number
        };

        const result = clientSchema.safeParse(schemaData);

        if (!result.success) {
            const newErrors: Record<string, string> = {};
            result.error.issues.forEach(err => {
                if (err.path[0]) {
                    // Map back schema keys to field names if necessary for error state keys
                    // But we used schema keys for validation. Let's use schema keys for 'errors' state
                    // and access them correctly in renderField.
                    // Special cases: document -> documentNumber, street -> streetName
                    let key = String(err.path[0]);
                    if (key === 'document') key = 'documentNumber';
                    if (key === 'street') key = 'streetName';
                    newErrors[key] = err.message;
                }
            });
            setErrors(newErrors);
            setAlert({ message: 'Corrija os erros verifique os campos.', type: 'error' });
            return;
        }

        // Clear errors if valid
        setErrors({});

        const updatedClient: Partial<Client> = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            documentNumber: formData.documentNumber,
            documentType: formData.documentType,
            mainAddress: {
                ...client.mainAddress,
                streetName: formData.streetName,
                number: formData.number,
                neighborhood: formData.neighborhood,
                city: formData.city,
                state: formData.state,
                postalCode: formData.zipCode,
                type: client.mainAddress?.type || 'RESIDENTIAL'
            }
        };

        clientsService.updateClient(client.id, updatedClient)
            .then((updated) => {
                setClient(updated);
                setIsEditing(false);
                setAlert({ message: 'Dados salvos com sucesso!', type: 'success' });
            })
            .catch(err => {
                console.error(err);
                setAlert({ message: 'Erro ao salvar dados.', type: 'error' });
            });
    };

    if (loading) return <div className={styles.container}>Carregando...</div>;

    const renderField = (label: string, value: string, inputComponent: React.ReactNode, required: boolean = false, error?: string) => (
        <div>
            <label className={styles.fieldLabel}>
                {label}
                {required && <span style={{ color: 'red', marginLeft: '4px' }}>*</span>}:
            </label>
            {isEditing ? (
                <>
                    {inputComponent}
                    {error && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px', display: 'block' }}>{error}</span>}
                </>
            ) : (
                <div className={styles.readOnlyField}>
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
                            onClick={() => {
                                setIsEditing(false);
                                setErrors({});
                                setAlert(null);
                            }}
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
                    <Button
                        text="Editar"
                        icon={<FontAwesomeIcon icon={faPen} />}
                        onClick={() => setIsEditing(true)}
                        width="fit-content"
                        ariaLabel="Editar Dados"
                    />
                )}
            </div>

            <div className={styles.card}>
                <h3 className={styles.sectionTitle}>Dados Cadastrais:</h3>
                <div className={styles.gridTwo}>
                    {renderField("Primeiro Nome", formData.firstName,
                        <Input value={formData.firstName} onChange={(v) => setFormData(p => ({ ...p, firstName: v }))} placeholder="" />,
                        true, errors.firstName
                    )}
                    {renderField("Segundo Nome", formData.lastName,
                        <Input value={formData.lastName} onChange={(v) => setFormData(p => ({ ...p, lastName: v }))} placeholder="" />,
                        true, errors.lastName
                    )}
                </div>
                <div className={styles.gridTwo}>
                    {renderField("E-mail", formData.email,
                        <Input value={formData.email} onChange={(v) => setFormData(p => ({ ...p, email: v }))} placeholder="" />,
                        true, errors.email
                    )}
                    {renderField("Telefone", formData.phone,
                        <Input value={formData.phone} onChange={(v) => setFormData(p => ({ ...p, phone: v }))} placeholder="" />,
                        true, errors.phone
                    )}
                </div>
                <div className={styles.gridThree}>
                    {renderField("Número Documento", formData.documentNumber,
                        <Input value={formData.documentNumber} onChange={(v) => setFormData(p => ({ ...p, documentNumber: v }))} placeholder="" />,
                        true, errors.documentNumber
                    )}
                    {renderField("Tipo do Documento", formData.documentType,
                        <Select value={formData.documentType} onChange={(v) => setFormData(p => ({ ...p, documentType: v }))} className={styles.formSelect}>
                            <SelectOption value="CPF" label="CPF" />
                            <SelectOption value="CNPJ" label="CNPJ" />
                        </Select>,
                        true, errors.documentType
                    )}
                    {renderField("Notas", formData.notes,
                        <Input value={formData.notes} onChange={(v) => setFormData(p => ({ ...p, notes: v }))} placeholder="" />,
                        false, errors.notes
                    )}
                </div>
            </div>

            <div className={styles.card}>
                <h3 className={styles.sectionTitle}>Endereço:</h3>
                <div className={styles.gridFour}>
                    {renderField("CEP", formData.zipCode,
                        <Input value={formData.zipCode} onChange={(v) => setFormData(p => ({ ...p, zipCode: v }))} placeholder="" />,
                        isAddressFilled, errors.zipCode
                    )}
                    {renderField("Estado", formData.state,
                        <Input value={formData.state} onChange={(v) => setFormData(p => ({ ...p, state: v }))} placeholder="" maxLength={2} />,
                        isAddressFilled, errors.state
                    )}
                    {renderField("Cidade", formData.city,
                        <Input value={formData.city} onChange={(v) => setFormData(p => ({ ...p, city: v }))} placeholder="" />,
                        isAddressFilled, errors.city
                    )}
                    {renderField("Bairro", formData.neighborhood,
                        <Input value={formData.neighborhood} onChange={(v) => setFormData(p => ({ ...p, neighborhood: v }))} placeholder="" />,
                        isAddressFilled, errors.neighborhood
                    )}
                </div>
                <div className={styles.gridAddress}>
                    {renderField("Logradouro", formData.streetName,
                        <Input value={formData.streetName} onChange={(v) => setFormData(p => ({ ...p, streetName: v }))} placeholder="" />,
                        isAddressFilled, errors.streetName
                    )}
                    {renderField("Número", formData.number,
                        <Input value={formData.number} onChange={(v) => setFormData(p => ({ ...p, number: v }))} placeholder="" />,
                        isAddressFilled, errors.number
                    )}
                </div>
            </div>

            <div className={styles.card}>
                <h3 className={styles.sectionTitle}>Projetos:</h3>
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
                                <tr key={project.id} onClick={() => navigate(`/projetos/${project.id}`)} className={styles.projectRow}>
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
}
