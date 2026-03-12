import { faPlus, faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from "react";
import Swal from 'sweetalert2';
import MaterialDialog, { type MaterialDialogRef } from '../../components/dialogs/material_dialog/MaterialDialog';
import FilterBar from '../../components/layout/FilterBar';
import PageLayout from '../../components/layout/PageLayout';
import SecureComponent from '../../components/security/SecureComponent';
import MaterialTable, { type MaterialWithLinks } from '../../components/tables/material_table/MaterialTable';
import { Pagination } from '../../components/tables/pagination/Pagination';
import { Button, SearchInput, Select, SelectOption } from '../../components/ui/Form';
import MaterialService from '../../services/MaterialsService';
import styles from "./Materials.module.css";

export default function Materials() {
  const [materials, setMaterials] = useState<MaterialWithLinks[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<MaterialWithLinks[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const dialogRef = useRef<MaterialDialogRef>(null);
  const materialService = new MaterialService();

  const loadData = async () => {
    try {
      const data = await materialService.listMaterials();
      const materialsWithLinks: MaterialWithLinks[] = await Promise.all(
        data.map(async (m) => {
          try {
            const links = await materialService.listMaterialUrls(m.id);
            return { ...m, linksCount: links.length };
          } catch {
            return { ...m, linksCount: 0 };
          }
        })
      );
      setMaterials(materialsWithLinks);
      setFilteredMaterials(materialsWithLinks);
    } catch (err) {
      console.error("Erro ao carregar materiais", err);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredMaterials(materials);
      return;
    }
    const filtered = materials.filter((m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMaterials(filtered);
    setPage(1);
  }, [searchTerm, materials]);

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
  };

  const handleAddMaterial = () => {
    dialogRef.current?.openCreate();
  };

  const handleEdit = (id: number) => {
    dialogRef.current?.openEdit(id);
  };

  const handleDelete = (id: number) => {
    Swal.fire({
      title: 'Confirmar Exclusão',
      text: "Tem certeza que deseja excluir este material?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d32f2f',
      cancelButtonColor: '#ccc',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await materialService.deleteMaterial(id);
          Swal.fire(
            'Excluído!',
            'Material excluído com sucesso.',
            'success'
          );
          loadData();
        } catch (e) {
          console.error(e);
          Swal.fire(
            'Erro!',
            'Erro ao excluir material.',
            'error'
          );
        }
      }
    });
  };

  const totalPages = Math.ceil(filteredMaterials.length / itemsPerPage) || 1;
  const currentMaterials = filteredMaterials.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <PageLayout
      title="Materiais"
      titleAccessory={<span className={styles.count}>({materials.length})</span>}
      rightActions={
        <SecureComponent permissions={["BUDGET_WRITE"]}>
          <Button
            icon={<FontAwesomeIcon icon={faPlus} />}
            text="Adicionar material"
            ariaLabel="Adicionar material"
            onClick={handleAddMaterial}
            width="fit-content"
          />
        </SecureComponent>
      }
    >
      <FilterBar>
        <div style={{ display: 'flex', gap: '1rem', width: '100%', alignItems: 'center' }}>
          <FontAwesomeIcon icon={faFilter} style={{ color: "var(--secondary)" }} />
          <span style={{ fontWeight: 600, color: "var(--secondary)" }}>Filtro:</span>
          <div className={styles.dropdown} style={{ width: '200px' }}>
            <Select value={"Todos"} onChange={() => {}}>
              <SelectOption value="Todos" label="Todos os itens" />
            </Select>
          </div>

          <div className={styles.searchBox} style={{ marginLeft: "auto" }}>
            <SearchInput
              onChange={handleSearchChange}
              value={searchTerm}
              placeholder="Buscar Item"
            />
          </div>
        </div>
      </FilterBar>

      <MaterialTable
        materials={currentMaterials}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRowClick={handleEdit}
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <MaterialDialog 
        ref={dialogRef}
        onMaterialCreated={loadData}
        onMaterialUpdated={loadData}
      />
    </PageLayout>
  );
}
