import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form";
import type {
  CoworkerFormData,
  CoworkerFormProps,
  CoworkerFormRef,
} from "../../../interfaces/properties/FormProps";
import {
  coworkerEditSchema,
  coworkerSchema,
} from "../../../schemas/coworkerSchema";
import {
  Input,
  PasswordInput,
  PhoneInput,
  Select,
  SelectOption,
} from "../../ui/Form";
import styles from "./CoworkerForm.module.css";

interface BasicInfoFormProps {
  mode: "create" | "edit";
  readOnly?: boolean;
}

function CoworkerBasicInfoForm({ mode, readOnly }: BasicInfoFormProps) {
  const { control, watch } = useFormContext<CoworkerFormData>();
  const formValues = watch();

  if (readOnly) {
    return (
      <div className={styles.container}>
        <div className={styles.gridTwo}>
          <div>
            <label className={styles.fieldLabel}>Primeiro Nome:</label>
            <div className={styles.readOnlyField}>
              {formValues.firstName || "-"}
            </div>
          </div>
          <div>
            <label className={styles.fieldLabel}>Segundo Nome:</label>
            <div className={styles.readOnlyField}>
              {formValues.secondName || "-"}
            </div>
          </div>
        </div>

        <div className={styles.gridTwo}>
          <div>
            <label className={styles.fieldLabel}>Email:</label>
            <div className={styles.readOnlyField}>
              {formValues.email || "-"}
            </div>
          </div>
          <div>
            <label className={styles.fieldLabel}>Telefone:</label>
            <div className={styles.readOnlyField}>
              {formValues.phone || "-"}
            </div>
          </div>
        </div>

        <div className={styles.gridTwo}>
          <div>
            <label className={styles.fieldLabel}>Perfil de Permissão:</label>
            <div className={styles.readOnlyField}>
              {formValues.permissionGroupRole || "-"}
            </div>
          </div>
          {mode === "create" && (
            <div>
              <label className={styles.fieldLabel}>Senha:</label>
              <div className={styles.readOnlyField}>
                {formValues.password ? "••••••••" : "-"}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.gridTwo}>
        <div className={styles.inputGroup}>
          <label htmlFor="firstName" className={styles.fieldLabel}>
            Primeiro Nome <span className={styles.required}>*</span>
          </label>
          <Controller
            name="firstName"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <>
                <Input
                  {...field}
                  id="firstName"
                  placeholder="Ex: João"
                  className={error ? styles.inputError : ""}
                />
                {error && (
                  <span className={styles.errorMessage}>{error.message}</span>
                )}
              </>
            )}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="secondName" className={styles.fieldLabel}>
            Segundo Nome <span className={styles.required}>*</span>
          </label>
          <Controller
            name="secondName"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <>
                <Input
                  {...field}
                  id="secondName"
                  placeholder="Ex: Silva"
                  className={error ? styles.inputError : ""}
                />
                {error && (
                  <span className={styles.errorMessage}>{error.message}</span>
                )}
              </>
            )}
          />
        </div>
      </div>

      <div className={styles.gridTwo}>
        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.fieldLabel}>
            Email <span className={styles.required}>*</span>
          </label>
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <>
                <Input
                  {...field}
                  id="email"
                  type="email"
                  placeholder="exemplo@email.com"
                  className={error ? styles.inputError : ""}
                />
                {error && (
                  <span className={styles.errorMessage}>{error.message}</span>
                )}
              </>
            )}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="phone" className={styles.fieldLabel}>
            Telefone <span className={styles.required}>*</span>
          </label>
          <Controller
            name="phone"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <>
                <PhoneInput
                  {...field}
                  id="phone"
                  className={error ? styles.inputError : ""}
                />
                {error && (
                  <span className={styles.errorMessage}>{error.message}</span>
                )}
              </>
            )}
          />
        </div>
      </div>

      <div className={styles.gridTwo}>
        <div className={styles.inputGroup}>
          <label htmlFor="permissionGroupRole" className={styles.fieldLabel}>
            Perfil de Permissão <span className={styles.required}>*</span>
          </label>
          <Controller
            name="permissionGroupRole"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <>
                <Select
                  {...field}
                  id="permissionGroupRole"
                  className={error ? styles.inputError : ""}
                >
                  <SelectOption value="" label="Selecione um perfil" />
                  <SelectOption value="Admin" label="Admin" />
                  <SelectOption value="Tecnico" label="Tecnico" />
                  <SelectOption value="Secretaria" label="Secretaria" />
                </Select>
                {error && (
                  <span className={styles.errorMessage}>{error.message}</span>
                )}
              </>
            )}
          />
        </div>

        {mode === "create" && (
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.fieldLabel}>
              Senha <span className={styles.required}>*</span>
            </label>
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <PasswordInput
                    placeholder="Digite a senha"
                    value={field.value}
                    onChange={field.onChange}
                  />
                  {error && (
                    <span className={styles.errorMessage}>{error.message}</span>
                  )}
                </>
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
}

const CoworkerForm = forwardRef<CoworkerFormRef, CoworkerFormProps>(
  ({ onSubmit, defaultValues, readOnly, mode = "create" }, ref) => {
    const methods = useForm<CoworkerFormData>({
      resolver: zodResolver(
        mode === "edit" ? coworkerEditSchema : coworkerSchema,
      ),
      defaultValues: {
        firstName: "",
        secondName: "",
        email: "",
        phone: "",
        permissionGroupRole: "",
        ...(mode === "create" ? { password: "" } : {}),
        ...defaultValues,
      },
    });

    const { handleSubmit, reset } = methods;

    useEffect(() => {
      reset({
        firstName: "",
        secondName: "",
        email: "",
        phone: "",
        permissionGroupRole: "",
        ...(mode === "create" ? { password: "" } : {}),
        ...defaultValues,
      });
    }, [defaultValues, mode, reset]);

    useImperativeHandle(ref, () => ({
      submit: () => {
        handleSubmit((data) => onSubmit(data))();
      },
    }));

    return (
      <FormProvider {...methods}>
        <div className={styles.formContainer}>
          <div className={styles.card}>
            <h3 className={styles.sectionTitle}>Dados Cadastrais:</h3>
            <CoworkerBasicInfoForm mode={mode} readOnly={readOnly} />
          </div>
        </div>
      </FormProvider>
    );
  },
);

export default CoworkerForm;
