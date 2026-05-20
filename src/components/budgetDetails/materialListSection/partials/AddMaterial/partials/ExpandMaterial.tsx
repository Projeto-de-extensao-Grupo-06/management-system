import { faCaretUp, faCaretDown, faPlusCircle, faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import type { BudgetMaterial } from "../../../../../../interfaces/types/Budget";
import type { MaterialUrl } from "../../../../../../interfaces/types/Material";
import MaterialService from "../../../../../../services/MaterialsService";

interface ExpandMaterialProps {
    materialId: number;
    name: string;
    description: string | null;
    budgetMaterials: BudgetMaterial[];
    onAddMaterial?: (materialUrl: MaterialUrl) => void;
    onRemoveMaterial?: (materialUrl: MaterialUrl) => void;
}

const materialService = new MaterialService();

export default function ExpandMaterial({ materialId, name, description, budgetMaterials, onAddMaterial, onRemoveMaterial }: ExpandMaterialProps) {
    const [isExpand, setExpand] = useState(false);
    const [urls, setUrls] = useState<MaterialUrl[]>([]);
    const [loadingUrls, setLoadingUrls] = useState(false);

    function handleExpand() {
        setExpand(!isExpand);

        if (!isExpand) {
            getMaterialUrls();
        }

        setLoadingUrls(false);
    }

    async function getMaterialUrls() {
        setLoadingUrls(true);
        const materialsUrls = await materialService.listMaterialUrls(materialId);
        setUrls(materialsUrls);
    }

    const urlsList = urls.map((u, index) => (
        <li key={index} className="urlListItem">
            <a
                href={u.url}
                className="url"
                target="_blank"
                rel="noopener noreferrer"
                title={u.url}
            >
                {u.url.length > 40 ? `${u.url.substring(0, 40)}…` : u.url}
            </a>

            <span className="materialPrice">{u.price.toLocaleString("pt-br", { style: "currency", currency: "BRL" })}</span>

            {
                budgetMaterials.some(m => m.materialUrlId === u.id) ? (
                    <span className="addButton" onClick={() => onRemoveMaterial && onRemoveMaterial(u)}><FontAwesomeIcon icon={faMinusCircle} /> Remover</span>
                ) : (
                    <span className="addButton" onClick={() => onAddMaterial && onAddMaterial(u)}><FontAwesomeIcon icon={faPlusCircle} /> Adicionar</span>
                )
            }
        </li>
    ));

    return (
  <>
    <tr>
      <td>{name}</td>
      <td>{description}</td>
      <td onClick={handleExpand}>
        <FontAwesomeIcon
          icon={isExpand ? faCaretDown : faCaretUp}
          size="xl"
          cursor="pointer"
        />
      </td>
    </tr>

    {isExpand && (
      <tr>
        <td className="urlListRow" colSpan={3}>
          {loadingUrls ? (
            <>Carregando URLs...</>
          ) : urls.length > 0 ? (
            <>
              <span className="title">Fornecedores</span>
              <ul className="urlList">{urlsList}</ul>
            </>
          ) : (
            <>Nenhuma URL encontrada para este material.</>
          )}
        </td>
      </tr>
    )}
  </>
);
}