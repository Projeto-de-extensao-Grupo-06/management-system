import { useEffect, useMemo, useState } from "react";
import type { Material } from "../../../../../interfaces/types/Material";
import MaterialService from "../../../../../services/MaterialsService";
import FilterBar from "../../../../layout/FilterBar";
import Table from "../../../../tables/Table";
import { Input } from "../../../../ui/Form";
import "./AddMaterial.css";
import ExpandMaterial from "./partials/ExpandMaterial";

const materialsService = new MaterialService();

export default function AddMaterial() {
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
