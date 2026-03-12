import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useImperativeHandle } from "react";
import { useForm, Controller } from "react-hook-form";
import type { Material } from "../../../interfaces/types/Material";
import { materialSchema, type MaterialSchemaType } from "../../../schemas/materialSchema";
import { Input, Select, SelectOption, TextArea } from "../../ui/Form";
import styles from "./MaterialForm.module.css";

export interface MaterialFormRef {
  submit: () => void;
}

export interface MaterialFormProps {
  onSubmit: (data: MaterialSchemaType) => void;
  initialData?: Material | null;
}

const MaterialForm = forwardRef<MaterialFormRef, MaterialFormProps>(
  ({ onSubmit, initialData }, ref) => {
    const {
      register,
      handleSubmit,
      control,
      formState: { errors },
    } = useForm<MaterialSchemaType>({
      resolver: zodResolver(materialSchema),
      defaultValues: {
        name: initialData?.name || "",
        description: initialData?.description || "",
        metric: initialData?.metric || "UNIT",
      },
    });

    useImperativeHandle(ref, () => ({
      submit: () => {
        handleSubmit(onSubmit)();
      },
    }));

    return (
      <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>
            Nome do material:
          </label>
          <Input
            id="name"
            placeholder="Ex: Inversor..."
            {...register("name")}
          />
          {errors.name && (
            <span className={styles.errorText}>{errors.name.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="metric" className={styles.label}>
            Unidade de Medida:
          </label>
          <Controller
            control={control}
            name="metric"
            render={({ field }) => (
              <Select
                id="metric"
                value={field.value}
                onChange={field.onChange}
              >
                <SelectOption value="UNIT" label="Unidade" />
                <SelectOption value="METER" label="Metro" />
                <SelectOption value="CENTIMETER" label="Centímetro" />
              </Select>
            )}
          />
          {errors.metric && (
            <span className={styles.errorText}>{errors.metric.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.label}>
            Descrição:
          </label>
          <TextArea
            id="description"
            className={styles.textarea}
            placeholder="Descrição do material..."
            {...register("description")}
          />
          {errors.description && (
            <span className={styles.errorText}>{errors.description.message}</span>
          )}
        </div>
      </form>
    );
  }
);

MaterialForm.displayName = "MaterialForm";

export default MaterialForm;
