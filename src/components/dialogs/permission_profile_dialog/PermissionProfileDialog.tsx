import { faPlus, faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import type { PermissionProfileFormRef } from '../../../interfaces/properties/FormProps';
import type { PermissionProfile } from '../../../interfaces/types/PermissionProfile';
import type { PermissionProfileSchemaType } from '../../../schemas/permissionProfileSchema';
import PermissionProfileService from '../../../services/PermissionProfileService';
import PermissionProfileForm from '../../forms/permission_profile_form/PermissionProfileForm';
import { Button, SimpleButton } from '../../ui/Form';
import Modal from '../modal/Modal';
import styles from './PermissionProfileDialog.module.css';

function mapPermissionsToForm(permissions: any[]) {
    return permissions.map((p) => ({
        module: p.moduleName,
        view:   p.read   ?? false,
        create: p.write  ?? false,
        edit:   p.update ?? false,
        delete: p.delete ?? false,
    }));
}

export interface PermissionProfileDialogRef {
    openCreate: () => void;
    openEdit: (id: number) => void;
    openView: (id: number) => void;
    close: () => void;
}

export interface PermissionProfileDialogProps {
    onCreated: () => void;
    onUpdated: () => void;
    updateProfile?: (id: number, data: PermissionProfileSchemaType) => Promise<void>;
}

const PermissionProfileDialog = forwardRef<
    PermissionProfileDialogRef,
    PermissionProfileDialogProps
>(({ onCreated, onUpdated, updateProfile }, ref) => {

    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<'CREATE' | 'EDIT' | 'READ'>('CREATE');
    const [currentId, setCurrentId] = useState<number | null>(null);
    const [data, setData] = useState<PermissionProfile | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const formRef = useRef<PermissionProfileFormRef>(null);
    const service = new PermissionProfileService();

    const loadData = async (id: number) => {
        try {
            const result = await service.getById(id);
            setData(result);
        } catch {
            setErrorMsg('Erro ao carregar perfil.');
        }
    };

    useImperativeHandle(ref, () => ({
        openCreate: () => {
            setMode('CREATE');
            setCurrentId(null);
            setData(null);
            setErrorMsg(null);
            setIsOpen(true);
        },
        openEdit: async (id: number) => {
            setMode('EDIT');
            setCurrentId(id);
            setData(null);
            setErrorMsg(null);
            setIsOpen(true);
            loadData(id);
        },
        openView: async (id: number) => {
            setMode('READ');
            setCurrentId(id);
            setData(null);
            setErrorMsg(null);
            setIsOpen(true);
            loadData(id);
        },
        close: () => setIsOpen(false),
    }));

    const handleSubmit = async (formData: PermissionProfileSchemaType) => {
        setErrorMsg(null);

        try {
            if (mode === 'CREATE') {
                await service.create(formData);
                onCreated();
                setIsOpen(false);
            } else if (mode === 'EDIT' && currentId !== null) {
                if (updateProfile) {
                    await updateProfile(currentId, formData);
                } else {
                    await service.update(currentId, formData);
                }
                onUpdated();
                setIsOpen(false);
            }
        } catch (err) {
            setErrorMsg(
                err instanceof Error ? err.message : 'Erro ao salvar perfil.'
            );
        }
    };

    const triggerForm = () => formRef.current?.submit();

    const renderFooter = () => {
        if (mode === 'READ') {
            return (
                <div className={styles.footerRow}>
                    <Button
                        text="Editar"
                        icon={<FontAwesomeIcon icon={faPen} />}
                        onClick={() => setMode('EDIT')}
                        width="fit-content"
                    />
                </div>
            );
        }

        return (
            <div className={styles.footerRow}>
                <SimpleButton text="Cancelar" onClick={() => setIsOpen(false)} />
                <Button
                    text={mode === 'CREATE' ? 'Criar Perfil' : 'Salvar Alterações'}
                    icon={mode === 'CREATE' ? <FontAwesomeIcon icon={faPlus} /> : undefined}
                    onClick={triggerForm}
                    width="fit-content"
                />
            </div>
        );
    };

    const renderTitle = () => {
        if (mode === 'CREATE') return 'Criar Perfil de Permissão';
        if (mode === 'READ') return data?.role ? `Detalhes: ${data.role}` : 'Detalhes do Perfil';
        return data?.role ? `Editar: ${data.role}` : 'Editar Perfil';
    };

    return isOpen ? (
        <Modal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title={renderTitle()}
            footer={renderFooter()}
            maxWidth="800px"
        >
            {errorMsg && (
                <div className={styles.errorBanner}>{errorMsg}</div>
            )}

            <PermissionProfileForm
                ref={formRef}
                onSubmit={handleSubmit}
                defaultValues={
                    data
                        ? {
                            name: data.role,
                            mainModule: data.mainModule,
                            permissions: mapPermissionsToForm(data.permissions),
                        }
                        : undefined
                }
                readOnly={mode === 'READ'}
            />
        </Modal>
    ) : null;
});

PermissionProfileDialog.displayName = 'PermissionProfileDialog';
export default PermissionProfileDialog;
