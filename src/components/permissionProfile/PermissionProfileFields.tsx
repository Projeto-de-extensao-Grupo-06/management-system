import { useFormContext } from 'react-hook-form';
import styles from '../forms/permission_profile_form/PermissionProfileForm.module.css';
import { Input, Select, SelectOption } from '../../components/ui/Form';
import Table from '../../components/tables/Table';
import type { PermissionProfileSchemaType } from '../../schemas/permissionProfileSchema';

interface PermissionProfileFieldsProps {
    readOnly?: boolean;
}

const modules = ['CLIENTES', 'PROJETOS', 'AGENDA'];

export default function PermissionProfileFields({ readOnly }: PermissionProfileFieldsProps) {
    const {
        register,
        watch,
        setValue,
        formState: { errors },
    } = useFormContext<PermissionProfileSchemaType>();

    const permissions = watch('permissions') || [];

    const getPermission = (module: string) =>
        permissions.find((p) => p.module === module) || {
            module,
            view: false,
            create: false,
            edit: false,
            delete: false,
        };

    const updatePermission = (module: string, action: string, value: boolean) => {
        let updated = [...permissions];
        const index = updated.findIndex((p) => p.module === module);

        let current = getPermission(module);

        let newPerm = { ...current, [action]: value };

        if (['create', 'edit', 'delete'].includes(action) && value) {
            newPerm.view = true;
        }

        if (action === 'view' && !value) {
            newPerm.create = false;
            newPerm.edit = false;
            newPerm.delete = false;
        }

        if (index >= 0) {
            updated[index] = newPerm;
        } else {
            updated.push(newPerm);
        }

        setValue('permissions', updated);
    };

    const availableModulesForMain = permissions
        .filter((p) => p.view)
        .map((p) => p.module);

    return (
        <>
    
            <div className={styles.fieldGroup}>
                <label className={styles.label}>Nome *</label>
                <Input
                    {...register('name')}
                    placeholder="Ex: Vendedor, Técnico"
                    readOnly={readOnly}
                />
                {errors.name && (
                    <span className={styles.error}>{errors.name.message}</span>
                )}
            </div>

            <div className={styles.fieldGroup}>
                <label className={styles.label}>Permissões *</label>

                <Table
                    headers={['Módulo', 'Ver', 'Criar', 'Editar', 'Excluir']}
                    isEmpty={modules.length === 0}
                    emptyMessage="Nenhum módulo encontrado."
                >
                    {modules.map((module) => {
                        const perm = getPermission(module);

                        return (
                            <tr key={module}>
                                <td>{module}</td>

                                <td>
                                    <input
                                        type="checkbox"
                                        checked={perm.view}
                                        disabled={
                                            readOnly ||
                                            perm.create ||
                                            perm.edit ||
                                            perm.delete
                                        }
                                        onChange={(e) =>
                                            updatePermission(module, 'view', e.target.checked)
                                        }
                                    />
                                </td>

                                <td>
                                    <input
                                        type="checkbox"
                                        checked={perm.create}
                                        disabled={readOnly}
                                        onChange={(e) =>
                                            updatePermission(module, 'create', e.target.checked)
                                        }
                                    />
                                </td>

                                <td>
                                    <input
                                        type="checkbox"
                                        checked={perm.edit}
                                        disabled={readOnly}
                                        onChange={(e) =>
                                            updatePermission(module, 'edit', e.target.checked)
                                        }
                                    />
                                </td>

                                <td>
                                    <input
                                        type="checkbox"
                                        checked={perm.delete}
                                        disabled={readOnly}
                                        onChange={(e) =>
                                            updatePermission(module, 'delete', e.target.checked)
                                        }
                                    />
                                </td>
                            </tr>
                        );
                    })}
                </Table>
            </div>

    
            <div className={styles.fieldGroup}>
                <label className={styles.label}>
                    Módulo Principal (Tela Pós-Login) *
                </label>

                <Select
                    value={watch('mainModule') ?? ''}
                    onChange={(val) => setValue('mainModule', val)}
                    disabled={readOnly}
                >
                    <SelectOption value="" label="Selecione um módulo" />

                    {availableModulesForMain.map((mod) => (
                        <SelectOption key={mod} value={mod} label={mod} />
                    ))}
                </Select>

                {errors.mainModule && (
                    <span className={styles.error}>
                        {errors.mainModule.message}
                    </span>
                )}
            </div>
        </>
    );
}