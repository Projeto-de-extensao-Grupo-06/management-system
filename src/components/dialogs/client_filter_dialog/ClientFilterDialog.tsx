import { useEffect, useState } from "react";
import { useAddress } from "../../../hooks/useAddress";
import type { ClientFilterModalProps, ClientFilterState } from "../../../interfaces/properties/DialogProps";
import type { AddressLookupDto } from "../../../interfaces/types/AddressTypes";
import styles from "../../../pages/clients/Clients.module.css";

import { Button, Input, SimpleButton, MultiSelect } from "../../ui/Form";
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

    const selectedStates = localFilters.state ? localFilters.state.split(',') : [];

    const cities = selectedStates.length > 0
        ? Array.from(new Set(
            lookupData
                .filter(item => selectedStates.includes(item.state))
                .flatMap(item => item.cities)
        )).sort()
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
                const selectedStates = value ? value.split(',') : [];

                const validCities = selectedStates.length > 0
                    ? new Set(
                        lookupData
                            .filter(item => selectedStates.includes(item.state))
                            .flatMap(item => item.cities)
                    )
                    : new Set(lookupData.flatMap(item => item.cities));

                if (prev.city) {
                    const currentCities = prev.city.split(',');
                    const newValidCities = currentCities.filter(city => validCities.has(city));
                    updates.city = newValidCities.join(',');
                } else {
                    updates.city = '';
                }
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
                        <MultiSelect
                            value={localFilters.state ? localFilters.state.split(',').map(s => ({ value: s, label: s })) : []}
                            onChange={(newValue) => {
                                const selectedValues = newValue.map(v => v.value).join(',');
                                handleChange('state', selectedValues);
                            }}
                            options={states.map(state => ({ value: state, label: state }))}
                            placeholder="Selecione um estado"
                        />
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
                        <MultiSelect
                            value={localFilters.city ? localFilters.city.split(',').map(c => ({ value: c, label: c })) : []}
                            onChange={(newValue) => {
                                const selectedValues = newValue.map(v => v.value).join(',');
                                handleChange('city', selectedValues);
                            }}
                            options={cities.map(city => ({ value: city, label: city }))}
                            isDisabled={!localFilters.state && cities.length > 100}
                            placeholder="Selecione uma cidade"
                        />
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
