import { useState } from 'react';
import styles from './ClientForm.module.css';

export interface ClientFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    document: string;
    documentType: string;
    notes: string;
    zipCode: string;
    state: string;
    city: string;
    neighborhood: string;
    street: string;
    number: string;
}

export default function ClientForm() {
    const [formData, setFormData] = useState<ClientFormData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        document: '',
        documentType: 'CPF',
        notes: '',
        zipCode: '',
        state: '',
        city: '',
        neighborhood: '',
        street: '',
        number: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className={styles.formContainer}>

            {/* Dados Cadastrais */}
            <div>
                <h3 className={styles.tittlePrimary}>Dados Cadastrais:</h3>

                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Primeiro Nome:<span className={styles.required}>*</span></label>
                        <input
                            className={styles.input}
                            name="firstName"
                            placeholder="João Silva"
                            value={formData.firstName}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Segundo Nome:<span className={styles.required}>*</span></label>
                        <input
                            className={styles.input}
                            name="lastName"
                            placeholder="joao.silva@example.com"
                            value={formData.lastName}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>E-mail:<span className={styles.required}>*</span></label>
                        <input
                            className={styles.input}
                            name="email"
                            type="email"
                            placeholder="joao.silva@example.com"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Telefone:<span className={styles.required}>*</span></label>
                        <input
                            className={styles.input}
                            name="phone"
                            placeholder="(11) 98888-7777"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className={`${styles.row} ${styles.fourPattern}`}>
                    <div className={`${styles.formGroup} ${styles.fullWidth}`} style={{ gridColumn: 'span 2' }}>
                        <label className={styles.label}>Número Documento:<span className={styles.required}>*</span></label>
                        <input
                            className={styles.input}
                            name="document"
                            placeholder="999.999.999-99"
                            value={formData.document}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={`${styles.formGroup} ${styles.fullWidth}`} style={{ gridColumn: 'span 2' }}>
                        <label className={styles.label}>Tipo do Documento:<span className={styles.required}>*</span></label>
                        <select
                            className={styles.select}
                            name="documentType"
                            value={formData.documentType}
                            onChange={handleChange}
                        >
                            <option value="CPF">CPF</option>
                            <option value="CNPJ">CNPJ</option>
                        </select>
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={`${styles.formGroup}`} style={{ gridColumn: '1 / -1' }}>
                        <label className={styles.label}>Notas:</label>
                        <input
                            className={styles.input}
                            name="notes"
                            placeholder="Lorem ipsum dolor"
                            value={formData.notes}
                            onChange={handleChange}
                        />
                    </div>
                </div>

            </div>

            {/* Endereço */}
            <div>
                <h3 className={styles.tittlePrimary}>Endereço:</h3>

                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>CEP:<span className={styles.required}>*</span></label>
                        <input
                            className={styles.input}
                            name="zipCode"
                            placeholder="01414-000"
                            value={formData.zipCode}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Estado:<span className={styles.required}>*</span></label>
                        <input
                            className={styles.input}
                            name="state"
                            placeholder="São Paulo"
                            value={formData.state}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Cidade:<span className={styles.required}>*</span></label>
                        <input
                            className={styles.input}
                            name="city"
                            placeholder="São Paulo"
                            value={formData.city}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Bairro:<span className={styles.required}>*</span></label>
                        <input
                            className={styles.input}
                            name="neighborhood"
                            placeholder="Cerqueira César"
                            value={formData.neighborhood}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Logradouro:<span className={styles.required}>*</span></label>
                        <input
                            className={styles.input}
                            name="street"
                            placeholder="Rua Haddock Lobo"
                            value={formData.street}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Número:<span className={styles.required}>*</span></label>
                        <input
                            className={styles.input}
                            name="number"
                            placeholder="595"
                            value={formData.number}
                            onChange={handleChange}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}
