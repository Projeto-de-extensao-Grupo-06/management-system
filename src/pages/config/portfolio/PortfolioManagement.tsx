import { faArrowDown, faArrowUp, faPen, faPlus, faTrashCan, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useMemo, useState } from 'react';
import PageLayout from '../../../components/layout/PageLayout';
import Badge from '../../../components/ui/Badge';
import { Alert } from '../../../components/ui/Alert';
import { Button, Input, Select, SelectOption, SimpleButton, TextArea } from '../../../components/ui/Form';
import type ProjectSummary from '../../../interfaces/types/ProjectSummary';
import type { PortfolioEconomyType, PortfolioImage, PortfolioItem, PortfolioItemInput, PortfolioStatus } from '../../../interfaces/types/Portfolio';
import type { ProjectFile } from '../../../interfaces/types/File';
import AddressService from '../../../services/AddressService';
import BudgetService from '../../../services/BudgetService';
import FilesService from '../../../services/FilesService';
import PortfolioService from '../../../services/PortfolioService';
import ProjectsService from '../../../services/ProjectsService';
import styles from './PortfolioManagement.module.css';

type SourceChoice = 'manual' | 'crm';

type PortfolioDraft = {
  title: string;
  location: string;
  systemType: string;
  economyValue: string;
  economyType: PortfolioEconomyType;
  testimonial: string;
  status: PortfolioStatus;
  images: PortfolioImage[];
  source: {
    type: 'MANUAL' | 'CRM';
    projectId?: number;
    projectName?: string;
    clientName?: string;
  };
};

type ProjectAttachment = ProjectFile & {
  checked: boolean;
  previewUrl?: string;
};

const emptyDraft: PortfolioDraft = {
  title: '',
  location: '',
  systemType: '',
  economyValue: '',
  economyType: 'AMOUNT',
  testimonial: '',
  status: 'DRAFT',
  images: [],
  source: { type: 'MANUAL' },
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function systemLabel(systemType: string) {
  if (!systemType) return 'Sistema solar';

  return systemType
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function economyLabel(value: string, type: PortfolioEconomyType) {
  const numericValue = Number(value);

  if (!value || Number.isNaN(numericValue)) {
    return '';
  }

  return type === 'PERCENT' ? `${numericValue}%` : formatCurrency(numericValue);
}

function uniqueId(prefix: string) {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }

      reject(new Error('Não foi possível ler o arquivo.'));
    };

    reader.onerror = () => reject(new Error('Não foi possível ler o arquivo.'));
    reader.readAsDataURL(file);
  });
}

async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }

      reject(new Error('Não foi possível processar a imagem.'));
    };

    reader.onerror = () => reject(new Error('Não foi possível processar a imagem.'));
    reader.readAsDataURL(blob);
  });
}

function normalizeImages(images: PortfolioImage[]) {
  return [...images]
    .sort((left, right) => left.order - right.order)
    .map((image, index) => ({ ...image, order: index }));
}

export default function PortfolioManagement() {
  const portfolioService = useMemo(() => new PortfolioService(), []);
  const projectsService = useMemo(() => new ProjectsService(), []);
  const budgetService = useMemo(() => new BudgetService(), []);
  const addressService = useMemo(() => new AddressService(), []);
  const filesService = useMemo(() => new FilesService(), []);

  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [choiceModalOpen, setChoiceModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [sourceChoice, setSourceChoice] = useState<SourceChoice>('manual');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [projectResults, setProjectResults] = useState<ProjectSummary[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectSummary | null>(null);
  const [projectAttachments, setProjectAttachments] = useState<ProjectAttachment[]>([]);
  const [draft, setDraft] = useState<PortfolioDraft>(emptyDraft);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [globalAlert, setGlobalAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const loadItems = async () => {
    setLoading(true);

    try {
      const data = await portfolioService.listAll();
      setItems(data);
    } catch {
      setGlobalAlert({ message: 'Erro ao carregar o portfólio.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Gerenciamento de Portfólio | SolarWay';
    void loadItems();
  }, []);

  useEffect(() => {
    if (!searchModalOpen) return;

    const timeout = window.setTimeout(() => {
      setSearchLoading(true);

      projectsService
        .getAllProjects(0, 20, searchTerm.trim(), ['COMPLETED'])
        .then((response) => setProjectResults(response.content ?? []))
        .catch(() => setProjectResults([]))
        .finally(() => setSearchLoading(false));
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [projectsService, searchModalOpen, searchTerm]);

  const closeEditor = () => {
    setEditorOpen(false);
    setEditingId(null);
    setDraft(emptyDraft);
    setSelectedProject(null);
    setProjectAttachments([]);
  };

  const openManualFlow = () => {
    setSourceChoice('manual');
    setChoiceModalOpen(false);
    setDraft({ ...emptyDraft, source: { type: 'MANUAL' } });
    setEditingId(null);
    setEditorOpen(true);
  };

  const openCrmSearch = () => {
    setSourceChoice('crm');
    setChoiceModalOpen(false);
    setSearchTerm('');
    setProjectResults([]);
    setSearchModalOpen(true);
  };

  const selectProject = async (project: ProjectSummary) => {
    setSearchModalOpen(false);
    setSelectedProject(project);
    setLoading(true);

    try {
      const budget = await budgetService.getProjectBudget(project.id);
      const clientAddress = project.client?.mainAddress?.id
        ? await addressService.getAddressById(project.client.mainAddress.id)
        : null;
      const attachments = await filesService.listProjectFiles(project.id);

      setDraft({
        title: project.projectTitle,
        location: clientAddress
          ? [clientAddress.streetName, clientAddress.number, clientAddress.neighborhood, clientAddress.city, clientAddress.state]
              .filter(Boolean)
              .join(' - ')
          : project.client?.mainAddress
            ? [project.client.mainAddress.streetName, project.client.mainAddress.number, project.client.mainAddress.neighborhood, project.client.mainAddress.city, project.client.mainAddress.state]
                .filter(Boolean)
                .join(' - ')
            : '',
        systemType: project.systemType ?? '',
        economyValue: budget ? String(budget.discount) : '',
        economyType: budget?.discountType === 'PERCENT' ? 'PERCENT' : 'AMOUNT',
        testimonial: '',
        status: 'DRAFT',
        images: [],
        source: {
          type: 'CRM',
          projectId: project.id,
          projectName: project.projectTitle,
          clientName: `${project.client?.firstName ?? ''} ${project.client?.lastName ?? ''}`.trim(),
        },
      });

      const importedAttachments = await Promise.all(
        attachments.map(async (attachment) => {
          try {
            const blob = await filesService.downloadFileBlob(project.id, attachment.id);
            const previewUrl = await blobToDataUrl(blob);

            return {
              ...attachment,
              checked: true,
              previewUrl,
            } satisfies ProjectAttachment;
          } catch {
            return {
              ...attachment,
              checked: false,
            } satisfies ProjectAttachment;
          }
        }),
      );

      setProjectAttachments(importedAttachments);
      setEditorOpen(true);
    } catch {
      setDraft({
        title: project.projectTitle,
        location: '',
        systemType: project.systemType ?? '',
        economyValue: '',
        economyType: 'AMOUNT',
        testimonial: '',
        status: 'DRAFT',
        images: [],
        source: {
          type: 'CRM',
          projectId: project.id,
          projectName: project.projectTitle,
          clientName: `${project.client?.firstName ?? ''} ${project.client?.lastName ?? ''}`.trim(),
        },
      });
      setProjectAttachments([]);
      setEditorOpen(true);
      setGlobalAlert({ message: 'Projeto selecionado. Alguns dados adicionais não puderam ser carregados.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (item: PortfolioItem) => {
    setEditingId(item.id);
    setSourceChoice(item.source.type === 'CRM' ? 'crm' : 'manual');
    setDraft({
      title: item.title,
      location: item.location,
      systemType: item.systemType,
      economyValue: String(item.economyValue),
      economyType: item.economyType,
      testimonial: item.testimonial ?? '',
      status: item.status,
      images: normalizeImages(item.images),
      source: item.source,
    });
    setProjectAttachments([]);
    setSelectedProject(null);
    setEditorOpen(true);
  };

  const addImageFiles = async (files: FileList | null) => {
    if (!files?.length) return;

    const importedImages = await Promise.all(
      Array.from(files).map(async (file, index) => ({
        id: uniqueId(`upload-${index}`),
        name: file.name,
        src: await fileToDataUrl(file),
        order: draft.images.length + index,
      })),
    );

    setDraft((current) => ({
      ...current,
      images: normalizeImages([...current.images, ...importedImages]),
    }));
  };

  const importSelectedCrmFiles = async () => {
    if (!selectedProject) return;

    const selectedAttachments = projectAttachments.filter((attachment) => attachment.checked);

    if (selectedAttachments.length === 0) {
      setGlobalAlert({ message: 'Selecione ao menos um anexo do CRM.', type: 'error' });
      return;
    }

    try {
      const importedImages = await Promise.all(
        selectedAttachments.map(async (attachment, index) => {
          const blob = await filesService.downloadFileBlob(selectedProject.id, attachment.id);
          const src = await blobToDataUrl(blob);

          return {
            id: uniqueId(`crm-${attachment.id}-${index}`),
            name: attachment.originalFilename,
            src,
            order: draft.images.length + index,
            sourceFileId: attachment.id,
            sourceFileName: attachment.originalFilename,
          } satisfies PortfolioImage;
        }),
      );

      setDraft((current) => ({
        ...current,
        images: normalizeImages([...current.images, ...importedImages]),
      }));

      setProjectAttachments((current) => current.map((attachment) => ({ ...attachment, checked: false })));
    } catch {
      setGlobalAlert({ message: 'Não foi possível importar os arquivos do CRM.', type: 'error' });
    }
  };

  const savePortfolio = async () => {
    setSaving(true);

    try {
      const payload: PortfolioItemInput = {
        title: draft.title.trim(),
        location: draft.location.trim(),
        systemType: draft.systemType.trim(),
        economyValue: Number(draft.economyValue || 0),
        economyType: draft.economyType,
        testimonial: draft.testimonial.trim(),
        status: draft.status,
        sortOrder: editingId ? items.find((item) => item.id === editingId)?.sortOrder ?? items.length : items.length,
        source: draft.source,
        images: normalizeImages(draft.images),
      };

      if (!payload.title) {
        setGlobalAlert({ message: 'Informe um título para o case.', type: 'error' });
        return;
      }

      if (!payload.images.length) {
        setGlobalAlert({ message: 'Adicione pelo menos uma imagem.', type: 'error' });
        return;
      }

      if (editingId) {
        await portfolioService.update(editingId, payload);
      } else {
        await portfolioService.create(payload);
      }

      window.dispatchEvent(new Event('portfolio-updated'));
      setGlobalAlert({ message: editingId ? 'Case atualizado com sucesso.' : 'Case criado com sucesso.', type: 'success' });
      closeEditor();
      await loadItems();
    } catch {
      setGlobalAlert({ message: 'Não foi possível salvar o portfólio.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const deletePortfolio = async (id: number) => {
    const confirmed = window.confirm('Deseja excluir este case do portfólio?');

    if (!confirmed) return;

    try {
      await portfolioService.delete(id);
      window.dispatchEvent(new Event('portfolio-updated'));
      setGlobalAlert({ message: 'Case excluído com sucesso.', type: 'success' });
      await loadItems();
    } catch {
      setGlobalAlert({ message: 'Não foi possível excluir o case.', type: 'error' });
    }
  };

  const moveItem = async (id: number, direction: 'up' | 'down') => {
    const currentIndex = items.findIndex((item) => item.id === id);

    if (currentIndex < 0) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= items.length) return;

    const reordered = [...items];
    [reordered[currentIndex], reordered[targetIndex]] = [reordered[targetIndex], reordered[currentIndex]];

    try {
      await portfolioService.reorder(reordered.map((item) => item.id));
      window.dispatchEvent(new Event('portfolio-updated'));
      await loadItems();
    } catch {
      setGlobalAlert({ message: 'Não foi possível alterar a ordem.', type: 'error' });
    }
  };

  const filteredCounts = {
    published: items.filter((item) => item.status === 'PUBLISHED').length,
    draft: items.filter((item) => item.status === 'DRAFT').length,
  };

  return (
    <PageLayout
      title="Gerenciamento de Portfólio"
      rightActions={
        <div className={styles.headerActions}>
          <Button
            text="Adicionar ao Portfólio"
            icon={<FontAwesomeIcon icon={faPlus} />}
            type="button"
            onClick={() => setChoiceModalOpen(true)}
            width="fit-content"
          />
        </div>
      }
    >
      {globalAlert && (
        <div className={styles.alertWrapper}>
          <Alert message={globalAlert.message} type={globalAlert.type} />
        </div>
      )}

      <div className={styles.summaryBar}>
        <div>
          <strong>{items.length}</strong> cases cadastrados
        </div>
        <div className={styles.summaryBadges}>
          <Badge variant="completed">{filteredCounts.published} publicados</Badge>
          <Badge variant="awaiting_retry">{filteredCounts.draft} rascunhos</Badge>
        </div>
      </div>

      {loading ? (
        <div className={styles.emptyState}>Carregando portfólio...</div>
      ) : items.length === 0 ? (
        <div className={styles.emptyState}>Nenhum case criado ainda.</div>
      ) : (
        <div className={styles.grid}>
          {items.map((item) => (
            <article key={item.id} className={styles.card}>
              <div className={styles.cover} style={{ backgroundImage: item.images[0]?.src ? `url(${item.images[0].src})` : undefined }}>
                {!item.images[0]?.src && <span>Sem imagem</span>}
              </div>

              <div className={styles.cardContent}>
                <div className={styles.cardTop}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.location || 'Local não informado'}</p>
                  </div>
                  <Badge variant={item.status === 'PUBLISHED' ? 'completed' : 'awaiting_retry'}>
                    {item.status === 'PUBLISHED' ? 'Publicado' : 'Rascunho'}
                  </Badge>
                </div>

                <div className={styles.metaRow}>
                  <span>{systemLabel(item.systemType)}</span>
                  <span>{economyLabel(String(item.economyValue), item.economyType)}</span>
                  <span>{item.images.length} imagens</span>
                </div>

                {item.testimonial && <p className={styles.testimonial}>{item.testimonial}</p>}

                <div className={styles.cardFooter}>
                  <div className={styles.actionGroup}>
                    <SimpleButton type="button" text="↑" ariaLabel="Mover para cima" icon={<FontAwesomeIcon icon={faArrowUp} />} onClick={() => void moveItem(item.id, 'up')} disabled={item.id === items[0]?.id} />
                    <SimpleButton type="button" text="↓" ariaLabel="Mover para baixo" icon={<FontAwesomeIcon icon={faArrowDown} />} onClick={() => void moveItem(item.id, 'down')} disabled={item.id === items[items.length - 1]?.id} />
                  </div>

                  <div className={styles.actionGroup}>
                    <SimpleButton type="button" text="Editar" ariaLabel="Editar case" icon={<FontAwesomeIcon icon={faPen} />} onClick={() => openEdit(item)} />
                    <SimpleButton type="button" text="Excluir" ariaLabel="Excluir case" icon={<FontAwesomeIcon icon={faTrashCan} />} onClick={() => void deletePortfolio(item.id)} />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {choiceModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setChoiceModalOpen(false)}>
          <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
            <h2>Adicionar ao Portfólio</h2>
            <p>Escolha como deseja criar o case de sucesso.</p>

            <div className={styles.choiceGrid}>
              <button className={styles.choiceCard} type="button" onClick={openCrmSearch}>
                <strong>A partir de um Projeto do CRM</strong>
                <span>Busque um projeto concluído e aproveite os dados disponíveis.</span>
              </button>

              <button className={styles.choiceCard} type="button" onClick={openManualFlow}>
                <strong>Criar Entrada Manualmente</strong>
                <span>Abra o formulário em branco e monte o case do zero.</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {searchModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setSearchModalOpen(false)}>
          <div className={styles.modalLarge} onClick={(event) => event.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h2>Selecionar projeto do CRM</h2>
                <p>Busque pelo nome do projeto ou cliente.</p>
              </div>
              <SimpleButton type="button" text="Fechar" ariaLabel="Fechar" onClick={() => setSearchModalOpen(false)} />
            </div>

            <div className={styles.searchBox}>
              <Input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Buscar projeto ou cliente" />
            </div>

            <div className={styles.projectList}>
              {searchLoading ? (
                <div className={styles.emptyState}>Buscando projetos...</div>
              ) : projectResults.length === 0 ? (
                <div className={styles.emptyState}>Nenhum projeto concluído encontrado.</div>
              ) : projectResults.map((project) => (
                <button className={styles.projectItem} type="button" key={project.id} onClick={() => void selectProject(project)}>
                  <div>
                    <strong>{project.projectTitle}</strong>
                    <span>{project.client ? `${project.client.firstName} ${project.client.lastName}`.trim() : 'Cliente não informado'}</span>
                  </div>
                  <Badge variant="completed">Concluído</Badge>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {editorOpen && (
        <div className={styles.modalOverlay} onClick={closeEditor}>
          <div className={styles.modalEditor} onClick={(event) => event.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h2>{editingId ? 'Editar case' : 'Novo case'}</h2>
                <p>{sourceChoice === 'crm' ? 'Os dados do CRM foram usados como ponto de partida.' : 'Preencha os campos manualmente.'}</p>
              </div>
              <SimpleButton type="button" text="Fechar" ariaLabel="Fechar" onClick={closeEditor} />
            </div>

            <div className={styles.editorGrid}>
              <label className={styles.field}>
                <span>Título do case</span>
                <Input value={draft.title} onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))} placeholder="Título do case" />
              </label>

              <label className={styles.field}>
                <span>Local da instalação</span>
                <Input value={draft.location} onChange={(event) => setDraft((current) => ({ ...current, location: event.target.value }))} placeholder="Cidade / Estado ou endereço" />
              </label>

              <label className={styles.field}>
                <span>Tipo de sistema</span>
                <Select value={draft.systemType} onChange={(value) => setDraft((current) => ({ ...current, systemType: value }))}>
                  <SelectOption value="" label="Selecione" />
                  <SelectOption value="ON_GRID" label="On-grid" />
                  <SelectOption value="OFF_GRID" label="Off-grid" />
                </Select>
              </label>

              <label className={styles.field}>
                <span>Economia gerada</span>
                <div className={styles.inlineFields}>
                  <Input type="number" min="0" step="0.01" value={draft.economyValue} onChange={(event) => setDraft((current) => ({ ...current, economyValue: event.target.value }))} placeholder="0" />
                  <Select value={draft.economyType} onChange={(value) => setDraft((current) => ({ ...current, economyType: value as PortfolioEconomyType }))}>
                    <SelectOption value="AMOUNT" label="R$" />
                    <SelectOption value="PERCENT" label="%" />
                  </Select>
                </div>
              </label>

              <label className={styles.field}>
                <span>Status</span>
                <Select value={draft.status} onChange={(value) => setDraft((current) => ({ ...current, status: value as PortfolioStatus }))}>
                  <SelectOption value="PUBLISHED" label="Publicado" />
                  <SelectOption value="DRAFT" label="Rascunho" />
                </Select>
              </label>

              <label className={styles.fieldWide}>
                <span>Depoimento do cliente</span>
                <TextArea value={draft.testimonial} onChange={(event) => setDraft((current) => ({ ...current, testimonial: event.target.value }))} placeholder="Depoimento opcional" />
              </label>
            </div>

            {draft.source.type === 'CRM' && selectedProject && (
              <div className={styles.importPanel}>
                <div className={styles.modalHeader}>
                  <div>
                    <h3>Arquivos do CRM</h3>
                    <p>Escolha quais anexos devem virar imagens do case.</p>
                  </div>
                  <Button type="button" text="Importar selecionados" icon={<FontAwesomeIcon icon={faUpload} />} onClick={() => void importSelectedCrmFiles()} width="fit-content" />
                </div>

                {projectAttachments.length === 0 ? (
                  <div className={styles.emptyState}>Nenhum anexo disponível para esse projeto.</div>
                ) : (
                  <div className={styles.attachmentGrid}>
                    {projectAttachments.map((attachment) => (
                      <label key={attachment.id} className={styles.attachmentCard}>
                        <input
                          type="checkbox"
                          checked={attachment.checked}
                          onChange={(event) => setProjectAttachments((current) => current.map((item) => (item.id === attachment.id ? { ...item, checked: event.target.checked } : item)))}
                        />
                        <div className={styles.attachmentPreview} style={attachment.previewUrl ? { backgroundImage: `url(${attachment.previewUrl})` } : undefined}>
                          {!attachment.previewUrl && <span>{attachment.originalFilename}</span>}
                        </div>
                        <strong>{attachment.originalFilename}</strong>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className={styles.importPanel}>
              <div className={styles.modalHeader}>
                <div>
                  <h3>Galeria de imagens</h3>
                  <p>Faça upload de novas imagens e reorganize a ordem de exibição.</p>
                </div>
                <label className={styles.uploadButton}>
                  <FontAwesomeIcon icon={faUpload} />
                  <span>Upload de imagens</span>
                  <input type="file" accept="image/*" multiple onChange={(event) => void addImageFiles(event.target.files)} />
                </label>
              </div>

              {draft.images.length === 0 ? (
                <div className={styles.emptyState}>Nenhuma imagem adicionada.</div>
              ) : (
                <div className={styles.imageGrid}>
                  {draft.images.map((image, index) => (
                    <div key={image.id} className={styles.imageCard}>
                      <div className={styles.imagePreview} style={{ backgroundImage: `url(${image.src})` }} />
                      <div className={styles.imageMeta}>
                        <strong>{image.name}</strong>
                        <div className={styles.imageActions}>
                          <SimpleButton
                            type="button"
                            text="↑"
                            ariaLabel="Mover imagem para cima"
                            onClick={() => setDraft((current) => {
                              if (index === 0) return current;
                              const nextImages = [...current.images];
                              [nextImages[index - 1], nextImages[index]] = [nextImages[index], nextImages[index - 1]];
                              return { ...current, images: normalizeImages(nextImages) };
                            })}
                            disabled={index === 0}
                          />
                          <SimpleButton
                            type="button"
                            text="↓"
                            ariaLabel="Mover imagem para baixo"
                            onClick={() => setDraft((current) => {
                              if (index === current.images.length - 1) return current;
                              const nextImages = [...current.images];
                              [nextImages[index + 1], nextImages[index]] = [nextImages[index], nextImages[index + 1]];
                              return { ...current, images: normalizeImages(nextImages) };
                            })}
                            disabled={index === draft.images.length - 1}
                          />
                          <SimpleButton
                            type="button"
                            text="Remover"
                            ariaLabel="Remover imagem"
                            onClick={() => setDraft((current) => ({ ...current, images: normalizeImages(current.images.filter((currentImage) => currentImage.id !== image.id)) }))}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.footerActions}>
              <SimpleButton text="Cancelar" ariaLabel="Cancelar" onClick={closeEditor} type="button" />
              <Button text={saving ? 'Salvando...' : 'Salvar case'} icon={<FontAwesomeIcon icon={faPlus} />} ariaLabel="Salvar portfólio" onClick={() => void savePortfolio()} width="fit-content" disabled={saving} />
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}