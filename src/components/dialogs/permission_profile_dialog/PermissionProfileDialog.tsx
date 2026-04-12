import { faPlus, faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import usePermissions from '../../../hooks/usePermissions';
import type { PermissionProfile } from '../../../../src/interfaces/types/PermissionProfile';
import type { PermissionProfileSchemaType } from '../../../schemas/permissionProfileSchema';
import PermissionProfileService from '../../../services/PermissionProfileService';
import PermissionProfileForm from '../../forms/permission_profile_form/PermissionProfileForm';
import type { PermissionProfileFormRef } from '../../../interfaces/properties/FormProps';
import { Button, SimpleButton } from '../../ui/Form';
import Modal from '../modal/Modal';
import styles from './PermissionProfileDialog.module.css';

function mapPermissionsToForm(
    permissions: Record<string, string[]>
) {
    return Object.entries(permissions).map(([module, actions]) => ({
        module,
        view: actions.includes('VIEW'),
        create: actions.includes('CREATE'),
        edit: actions.includes('EDIT'),
        delete: actions.includes('DELETE'),
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
}

const PermissionProfileDialog = forwardRef<
    PermissionProfileDialogRef,
    PermissionProfileDialogProps
>(({ onCreated, onUpdated }, ref) => {

    const permissions = usePermissions();
    // const canManage = permissions.includes('PERMISSION_PROFILE_UPDATE');

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
            setErrorMsg(null);
            setIsOpen(true);
            loadData(id);
        },

        openView: async (id: number) => {
            setMode('READ');
            setCurrentId(id);
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
            } else if (mode === 'EDIT' && currentId) {
                await service.update(currentId, formData);
                onUpdated();
                setIsOpen(false);
            }
        } catch (err) {
            setErrorMsg(
                err instanceof Error
                    ? err.message
                    : 'Erro ao salvar perfil.'
            );
        }
    };

    const triggerForm = () => {
        formRef.current?.submit();
    };

    const renderFooter = () => {
        if (mode === 'READ') {
            return (
                <div className={styles.footerRow}>
                    {/* {canManage && ( */}
                    <Button
                        text="Editar"
                        icon={<FontAwesomeIcon icon={faPen} />}
                        onClick={() => setMode('EDIT')}
                        width="fit-content"
                    />
                    {/* )} */}
                </div>
            );
        }

        return (
            <div className={styles.footerRow}>
                <SimpleButton
                    text="Cancelar"
                    onClick={() => setIsOpen(false)}
                />
                <Button
                    text={
                        mode === 'CREATE'
                            ? 'Criar Perfil'
                            : 'Salvar Alterações'
                    }
                    icon={
                        mode === 'CREATE'
                            ? <FontAwesomeIcon icon={faPlus} />
                            : undefined
                    }
                    onClick={triggerForm}
                    width="fit-content"
                />
            </div>
        );
    };

    const renderTitle = () => {
        if (mode === 'CREATE') return 'Criar Perfil de Permissão';
        if (mode === 'READ')
            return data?.name
                ? `Detalhes: ${data.name}`
                : 'Detalhes do Perfil';
        return data?.name
            ? `Editar: ${data.name}`
            : 'Editar Perfil';
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
                <div className={styles.errorBanner}>
                    {errorMsg}
                </div>
            )}

            <PermissionProfileForm
                ref={formRef}
                onSubmit={handleSubmit}
                defaultValues={
                    data
                        ? {
                            name: data.name,
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