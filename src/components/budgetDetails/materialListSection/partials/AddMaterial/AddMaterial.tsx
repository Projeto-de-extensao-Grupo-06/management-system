import { useEffect, useMemo, useState } from "react";
import type { Budget, BudgetMaterial } from "../../../../../interfaces/types/Budget";
import type { Material, MaterialUrl } from "../../../../../interfaces/types/Material";
import MaterialService from "../../../../../services/MaterialsService";
import FilterBar from "../../../../layout/FilterBar";
import Table from "../../../../tables/Table";
import { Input } from "../../../../ui/Form";
import "./AddMaterial.css";
import { budgetService } from "../../MaterialList";
import ExpandMaterial from "./partials/ExpandMaterial";

const materialsService = new MaterialService();

interface AddMaterialProps {
  materials: BudgetMaterial[];
  setBudget: React.Dispatch<React.SetStateAction<Budget>>;
  budget: Budget;
  projectId: number;
}

export default function AddMaterial({ materials, setBudget, budget, projectId }: AddMaterialProps) {
  const [materialsList, setMaterialsList] = useState<Material[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function listMaterials() {
      const materialsReq = await materialsService.listMaterials();
      setMaterialsList(materialsReq);
    }

    listMaterials();
  }, []);

  const searchMaterial = useMemo(() => {
    return materialsList.filter((m) => m.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
  }, [search, materialsList]);

  function removeMaterial(material: MaterialUrl) {
    budgetService.deleteMaterialUrl(budget.id, material.id);

    setBudget((prev) => {
      const copy = { ...prev };
      copy.materials = copy.materials.filter((m) => m.materialUrlId !== material.id);
      return copy;
    })
  }

  return (
    <div className="addMaterialContainer">
      <FilterBar>
        <Input
          value={search}
          type="text"
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Digite o nome do material"
        />
      </FilterBar>

      <Table headers={["Nome", "Descrição", "Expandir"]}>
        {searchMaterial.map((value, index) => {
          return (
            <ExpandMaterial
              onAddMaterial={(materialUrl) => {
                setBudget(prev => {
                  const newMaterials = {
                    ...prev, materials: [...prev.materials, {
                      materialUrlId: materialUrl.id,
                      name: value.name,
                      url: materialUrl.url,
                      unitPrice: materialUrl.price,
                      quantity: 1
                    }]
                  };

                  return newMaterials;
                });
              }}
              onRemoveMaterial={removeMaterial}
              budgetMaterials={materials}
              materialId={value.id}
              name={value.name}
              description={value.description}
              key={index}
            ></ExpandMaterial>
          );
        })}
      </Table>
    </div>
  );
}
