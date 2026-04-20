import { useFormContext } from 'react-hook-form';
import Table from '../../components/tables/Table';
import { Input, Select, SelectOption } from '../../components/ui/Form';
import type { PermissionProfileSchemaType } from '../../schemas/permissionProfileSchema';
import styles from '../forms/permission_profile_form/PermissionProfileForm.module.css';

interface PermissionProfileFieldsProps {
    readOnly?: boolean;
}

const modules = [
    { value: 'CLIENT',        label: 'Clientes'      },
    { value: 'PROJECT',       label: 'Projetos'      },
    { value: 'SCHEDULE',      label: 'Agenda'        },
    { value: 'MATERIAL',      label: 'Materiais'     },
    { value: 'BUDGET',        label: 'Orçamentos'    },
    { value: 'CONFIGURATION', label: 'Configurações' },
];

export default function PermissionProfileFields({ readOnly }: PermissionProfileFieldsProps) {
    const {
        register,
        watch,
        setValue,
        clearErrors,
        formState: { errors },
    } = useFormContext<PermissionProfileSchemaType>();

    const permissions = watch('permissions') || [];
    const mainModule = watch('mainModule');

    const getPermission = (moduleValue: string) =>
        permissions.find((p) => p.module === moduleValue) || {
            module: moduleValue,
            view: false,
            create: false,
            edit: false,
            delete: false,
        };

    const updatePermission = (moduleValue: string, action: string, value: boolean) => {
        const updated = [...permissions];
        const index = updated.findIndex((p) => p.module === moduleValue);
        const current = getPermission(moduleValue);
        const newPerm = { ...current, [action]: value };

        if (['create', 'edit', 'delete'].includes(action) && value) {
            newPerm.view = true;
        }

        if (action === 'view' && !value) {
            newPerm.create = false;
            newPerm.edit = false;
            newPerm.delete = false;

            if (mainModule === moduleValue) {
                setValue('mainModule', '');
            }
        }

        if (index >= 0) {
            updated[index] = newPerm;
        } else {
            updated.push(newPerm);
        }

        setValue('permissions', updated);
        clearErrors('permissions'); 
    };

    const availableModulesForMain = modules.filter((m) =>
        permissions.find((p) => p.module === m.value && p.view)
    );

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
                    className={styles.permissionsTable}
                    headers={['Módulo', 'Ver', 'Criar', 'Editar', 'Excluir']}
                    isEmpty={modules.length === 0}
                    emptyMessage="Nenhum módulo encontrado."
                >
                    {modules.map(({ value, label }) => {
                        const perm = getPermission(value);
                        const isViewForced = perm.create || perm.edit || perm.delete;

                        return (
                            <tr key={value}>
                                <td>{label}</td>

                                <td>
                                    <input
                                        type="checkbox"
                                        checked={perm.view}
                                        disabled={readOnly || isViewForced}
                                        onChange={(e) =>
                                            updatePermission(value, 'view', e.target.checked)
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={perm.create}
                                        disabled={readOnly}
                                        onChange={(e) =>
                                            updatePermission(value, 'create', e.target.checked)
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={perm.edit}
                                        disabled={readOnly}
                                        onChange={(e) =>
                                            updatePermission(value, 'edit', e.target.checked)
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={perm.delete}
                                        disabled={readOnly}
                                        onChange={(e) =>
                                            updatePermission(value, 'delete', e.target.checked)
                                        }
                                    />
                                </td>
                            </tr>
                        );
                    })}
                </Table>

                {errors.permissions && (
                    <span className={styles.error}>
                        {typeof errors.permissions.message === 'string'
                            ? errors.permissions.message
                            : 'Defina ao menos uma permissão.'}
                    </span>
                )}
            </div>

            <div className={styles.fieldGroup}>
                <label className={styles.label}>
                    Módulo Principal (Tela Pós-Login) *
                </label>

                <Select
                    value={mainModule ?? ''}
                    onChange={(val) => {
                        setValue('mainModule', val);
                        if (val) clearErrors('mainModule'); 
                    }}
                    disabled={readOnly || availableModulesForMain.length === 0}
                >
                    <SelectOption value="" label="Selecione um módulo" />
                    {availableModulesForMain.map(({ value, label }) => (
                        <SelectOption key={value} value={value} label={label} />
                    ))}
                </Select>

                {errors.mainModule && (
                    <span className={styles.error}>{errors.mainModule.message}</span>
                )}

                {!readOnly && availableModulesForMain.length === 0 && (
                    <span className={styles.hint}>
                        Marque "Ver" em ao menos um módulo para habilitar esta seleção.
                    </span>
                )}
            </div>
        </>
    );
}