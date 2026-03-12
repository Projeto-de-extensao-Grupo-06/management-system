import { faPlus, faLink, faTrashCan, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import usePermissions from "../../../hooks/usePermissions";
import type { Material, MaterialUrl } from "../../../interfaces/types/Material";
import type { MaterialSchemaType } from "../../../schemas/materialSchema";
import type { MaterialUrlSchemaType } from "../../../schemas/materialUrlSchema";
import MaterialService from "../../../services/MaterialsService";
import MaterialForm, { type MaterialFormRef } from "../../forms/material_form/MaterialForm";
import MaterialUrlForm, { type MaterialUrlFormRef } from "../../forms/material_url_form/MaterialUrlForm";
import { Button, SimpleButton, IconButton } from "../../ui/Form";
import Modal from "../modal/Modal";
import styles from "./MaterialDialog.module.css";

export interface MaterialDialogRef {
  openCreate: () => void;
  openEdit: (materialId: number) => void;
  openView: (materialId: number) => void;
  close: () => void;
}

export interface MaterialDialogProps {
  onMaterialCreated: () => void;
  onMaterialUpdated: () => void;
}

const MaterialDialog = forwardRef<MaterialDialogRef, MaterialDialogProps>(
  ({ onMaterialCreated, onMaterialUpdated }, ref) => {
    const permissions = usePermissions();
    const canManage = permissions.includes("BUDGET_UPDATE");

    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<"CREATE" | "EDIT" | "READ" | "LINK_CREATE">("CREATE");
    const [currentMaterialId, setCurrentMaterialId] = useState<number | null>(null);
    const [materialData, setMaterialData] = useState<Material | null>(null);
    const [links, setLinks] = useState<MaterialUrl[]>([]);
    
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const materialFormRef = useRef<MaterialFormRef>(null);
    const linkFormRef = useRef<MaterialUrlFormRef>(null);
    const materialService = new MaterialService();

    const loadMaterialData = async (id: number) => {
      try {
        const mat = await materialService.getMaterialById(id);
        const matLinks = await materialService.listMaterialUrls(id);
        setMaterialData(mat);
        setLinks(matLinks);
      } catch {
        setErrorMsg("Erro ao carregar dados do material.");
      }
    };

    useImperativeHandle(ref, () => ({
      openCreate: () => {
        setMode("CREATE");
        setCurrentMaterialId(null);
        setMaterialData(null);
        setLinks([]);
        setErrorMsg(null);
        setIsOpen(true);
      },
      openEdit: async (materialId: number) => {
        setMode("EDIT");
        setCurrentMaterialId(materialId);
        setErrorMsg(null);
        setIsOpen(true);
        loadMaterialData(materialId);
      },
      openView: async (materialId: number) => {
        setMode("READ");
        setCurrentMaterialId(materialId);
        setErrorMsg(null);
        setIsOpen(true);
        loadMaterialData(materialId);
      },
      close: () => setIsOpen(false),
    }));

    const handleMaterialSubmit = async (data: MaterialSchemaType) => {
      setErrorMsg(null);
      try {
        const materialPayload = {
          ...data,
          description: data.description ?? null,
        } as Omit<Material, "id" | "hidden">;

        if (mode === "CREATE") {
          const newMaterial = await materialService.createMaterial(materialPayload);
          onMaterialCreated();
          setCurrentMaterialId(newMaterial.id);
          setMaterialData(newMaterial);
          setMode("EDIT");
        } else if (mode === "EDIT" && currentMaterialId) {
          await materialService.updateMaterial(currentMaterialId, materialPayload);
          onMaterialUpdated();
          setIsOpen(false);
        }
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : "Erro ao salvar material.");
      }
    };

    const handleLinkSubmit = async (data: MaterialUrlSchemaType) => {
      if (!currentMaterialId) return;
      setErrorMsg(null);
      try {
        await materialService.createMaterialUrl({
          ...data,
          materialId: currentMaterialId,
        });
        await loadMaterialData(currentMaterialId);
        setMode("EDIT");
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : "Erro ao adicionar link.");
      }
    };

    const handleDeleteLink = async (linkId: number) => {
      setErrorMsg(null);
      try {
        await materialService.deleteMaterialUrl(linkId);
        if (currentMaterialId) await loadMaterialData(currentMaterialId);
      } catch {
        setErrorMsg("Erro ao deletar link.");
      }
    };

    const triggerMaterialForm = () => {
      materialFormRef.current?.submit();
    };

    const triggerLinkForm = () => {
      linkFormRef.current?.submit();
    };

    const renderFooter = () => {
      if (mode === "LINK_CREATE") {
        return (
          <div className={styles.footerRow}>
            <SimpleButton text="Cancelar" onClick={() => setMode("EDIT")} />
            <Button text="Adicionar Link" onClick={triggerLinkForm} width="fit-content" />
          </div>
        );
      }
      if (mode === "READ") {
        return (
          <div className={styles.footerRow}>
            {canManage && (
              <Button
                text="Editar"
                icon={<FontAwesomeIcon icon={faPen} />}
                onClick={() => setMode("EDIT")}
                width="fit-content"
              />
            )}
          </div>
        );
      }
      return (
        <div className={styles.footerRow}>
          <SimpleButton text="Cancelar" onClick={() => setIsOpen(false)} />
          <Button
            text={mode === "CREATE" ? "Criar Material" : "Salvar Alterações"}
            icon={mode === "CREATE" ? <FontAwesomeIcon icon={faPlus} /> : undefined}
            onClick={triggerMaterialForm}
            width="fit-content"
          />
        </div>
      );
    };

    const renderTitle = () => {
      if (mode === "CREATE") return "Criar Material";
      if (mode === "LINK_CREATE") return "Adicionar Link";
      if (mode === "READ") return materialData?.name ? `Detalhes: ${materialData.name}` : "Detalhes do Material";
      return materialData?.name ? `Editar: ${materialData.name}` : "Editar Material";
    };

    return isOpen ? (
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={renderTitle()} footer={renderFooter()} maxWidth={mode === "LINK_CREATE" ? "500px" : "900px"}>
        {errorMsg && <div className={styles.errorBanner}>{errorMsg}</div>}
        
        {mode === "LINK_CREATE" ? (
          <MaterialUrlForm ref={linkFormRef} onSubmit={handleLinkSubmit} />
        ) : (
          <div className={styles.dualPane}>
            <div className={styles.formPane}>
              <MaterialForm ref={materialFormRef} onSubmit={handleMaterialSubmit} initialData={materialData} readOnly={mode === "READ"} />
            </div>
            
            <div className={styles.linksPane}>
              <div className={styles.linksHeader}>
                <h3>Links do Material</h3>
                <Button
                  text="Add Link"
                  icon={<FontAwesomeIcon icon={faPlus} />}
                  onClick={() => setMode("LINK_CREATE")}
                  disabled={mode === "CREATE" || mode === "READ"}
                  width="fit-content"
                />
              </div>
              {mode === "CREATE" && <p className={styles.infoText}>Crie o material primeiro para adicionar links.</p>}
              {(mode === "EDIT" || mode === "READ") && (
                <div className={styles.linksList}>
                  {links.length === 0 ? (
                    <p className={styles.infoText}>Nenhum link cadastrado.</p>
                  ) : (
                    links.map((link) => (
                      <div key={link.id} className={styles.linkCard}>
                        <a href={link.url} target="_blank" rel="noreferrer" className={styles.linkAnchor}>
                          <FontAwesomeIcon icon={faLink} /> {link.url}
                        </a>
                        <span className={styles.linkPrice}>
                          R$ {link.price.toFixed(2)}
                        </span>
                        {mode === "EDIT" && (
                          <IconButton
                            icon={<FontAwesomeIcon icon={faTrashCan} />}
                            functionality="delete"
                            onClick={() => handleDeleteLink(link.id)}
                            ariaLabel="Excluir Link"
                          />
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    ) : null;
  }
);

MaterialDialog.displayName = "MaterialDialog";
export default MaterialDialog;
