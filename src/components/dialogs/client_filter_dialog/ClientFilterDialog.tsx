import { useEffect, useState } from "react";
import { useAddress } from "../../../hooks/useAddress";
import type { ClientFilterModalProps, ClientFilterState } from "../../../interfaces/properties/DialogProps";
import type { AddressLookupDto } from "../../../interfaces/types/AddressTypes";
import styles from "../../../pages/clients/Clients.module.css";
import { Button, Input, Select, SimpleButton } from "../../ui/Form";
import Modal from "../modal/Modal";

export default function ClientFilterModal({ isOpen, onClose, filters: initialFilters, onApply, onClear }: ClientFilterModalProps) {
    const [localFilters, setLocalFilters] = useState<ClientFilterState>(initialFilters);

    const [lookupData, setLookupData] = useState<AddressLookupDto[]>([]);
    const { getAddressLookup } = useAddress();

    useEffect(() => {
        const fetchLookup = async () => {
            const data = await getAddressLookup();
            if (data) {
                setLookupData(data);
            }
        };
        fetchLookup();
    }, []);

    const states = lookupData.map(item => item.state).sort();
    const cities = localFilters.state
        ? lookupData.find(item => item.state === localFilters.state)?.cities.sort() || []
        : Array.from(new Set(lookupData.flatMap(item => item.cities))).sort();

    const handleApply = () => {
        onApply(localFilters);
        onClose();
    };

    const handleClear = () => {
        onClear();
        setLocalFilters({
            startDate: '',
            endDate: '',
            city: '',
            state: ''
        });
        onClose();
    };

    const handleChange = (field: keyof ClientFilterState, value: string) => {
        setLocalFilters((prev: ClientFilterState) => {
            const updates: Partial<ClientFilterState> = { [field]: value };
            if (field === 'state') {
                updates.city = '';
            }
            return { ...prev, ...updates };
        });
    };

    const footer = (
        <>
            <SimpleButton
                text="Limpar Filtros"
                ariaLabel="Limpar filtros"
                onClick={handleClear}
                width="fit-content"
            />
            <Button
                text="Aplicar Filtros"
                ariaLabel="Aplicar filtros"
                onClick={handleApply}
                width="fit-content"
            />
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Filtrar Clientes"
            footer={footer}
            maxWidth="500px"
        >
            <div className={styles.filterModalContainer}>
                <div>
                    <label className={styles.filterLabel}>Estado (UF)</label>
                    {states.length > 0 ? (
                        <Select
                            value={localFilters.state}
                            onChange={(value) => handleChange('state', value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                        >
                            <option value="">Selecione um estado</option>
                            {states.map(state => (
                                <option key={state} value={state}>{state}</option>
                            ))}
                        </Select>
                    ) : (
                        <Input
                            placeholder="Ex: SP"
                            maxLength={2}
                            value={localFilters.state}
                            onChange={(e) => handleChange('state', e.target.value)}
                        />
                    )}
                </div>
                <div>
                    <label className={styles.filterLabel}>Cidade</label>
                    {cities.length > 0 ? (
                        <Select
                            value={localFilters.city}
                            onChange={(value) => handleChange('city', value)}
                            disabled={!localFilters.state && cities.length > 100}
                            style={{ width: '100%' }}
                        >
                            <option value="">Selecione uma cidade</option>
                            {cities.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </Select>
                    ) : (
                        <Input
                            placeholder="Digite a cidade"
                            value={localFilters.city}
                            onChange={(e) => handleChange('city', e.target.value)}
                        />
                    )}
                </div>
                <div>
                    <label className={styles.filterLabel}>Data de Cadastro (Início)</label>
                    <Input
                        type="date"
                        placeholder=""
                        value={localFilters.startDate}
                        onChange={(e) => handleChange('startDate', e.target.value)}
                    />
                </div>
                <div>
                    <label className={styles.filterLabel}>Data de Cadastro (Fim)</label>
                    <Input
                        type="date"
                        placeholder=""
                        value={localFilters.endDate}
                        onChange={(e) => handleChange('endDate', e.target.value)}
                    />
                </div>
            </div>
        </Modal>
    );
}
