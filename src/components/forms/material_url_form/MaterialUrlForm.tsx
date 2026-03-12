import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import type { MaterialUrl } from "../../../interfaces/types/Material";
import { materialUrlSchema, type MaterialUrlSchemaType } from "../../../schemas/materialUrlSchema";
import { Input } from "../../ui/Form";
import styles from "./MaterialUrlForm.module.css";


export interface MaterialUrlFormRef {
  submit: () => void;
}

export interface MaterialUrlFormProps {
  onSubmit: (data: MaterialUrlSchemaType) => void;
  initialData?: MaterialUrl | null;
}

const MaterialUrlForm = forwardRef<MaterialUrlFormRef, MaterialUrlFormProps>(
  ({ onSubmit, initialData }, ref) => {
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<MaterialUrlSchemaType>({
      resolver: zodResolver(materialUrlSchema),
      defaultValues: {
        url: initialData?.url || "",
        price: initialData?.price || 0,
      },
    });

    useImperativeHandle(ref, () => ({
      submit: () => {
        handleSubmit(onSubmit)();
      },
    }));

    return (
      <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="url" className={styles.label}>
              Link:
            </label>
            <Input
              id="url"
              placeholder="Ex: https://solarsupply.com..."
              {...register("url")}
            />
            {errors.url && (
              <span className={styles.errorText} style={{ color: "#d32f2f", fontSize: "0.8rem" }}>{errors.url.message}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="price" className={styles.label}>
              Preço de venda:
            </label>
            <Input
              id="price"
              type="number"
              step="0.01"
              placeholder="Ex: 2649.00"
              {...register("price", { valueAsNumber: true })}
            />
            {errors.price && (
              <span className={styles.errorText} style={{ color: "#d32f2f", fontSize: "0.8rem" }}>{errors.price.message}</span>
            )}
          </div>
        </div>
      </form>
    );
  }
);

MaterialUrlForm.displayName = "MaterialUrlForm";

export default MaterialUrlForm;
