import { faCaretUp, faCaretDown, faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import MaterialService from "../../../../../../services/MaterialsService";
import type { MaterialUrl } from "../../../../../../interfaces/types/Material";
import { Button } from "../../../../../ui/Form";

interface ExpandMaterialProps {
    materialId: number;
    name: string;
    description: string | null;
}

const materialService = new MaterialService();

export default function ExpandMaterial({ materialId, name, description }: ExpandMaterialProps) {
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
            <a href={u.url} className="url" target="_blank" rel="noopener noreferrer">
                {u.url}
            </a>
            
            {/* <Button className="addButton" icon={<FontAwesomeIcon icon={faAdd} />} text="Adicionar" /> */}
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
                <td colSpan={3}>
                    {loadingUrls ? (
                        <p>Carregando URLs...</p>
                    ) : urls.length > 0 ? (
                        <ul className="urlList">{urlsList}</ul>
                    ) : (
                        <p>Nenhuma URL encontrada para este material.</p>
                    )}
                </td>
            )}
        </>
    );
}