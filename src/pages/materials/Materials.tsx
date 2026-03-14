import {
  faArrowUpRightFromSquare,
  faCopy,
  faFileLines,
  faMessage,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import PageLayout from "../../components/layout/PageLayout";
import MaterialModal, {
  type MaterialModalData,
} from "../../components/materials/MaterialModal";
import type { BudgetMaterial, ValueType } from "../../interfaces/types/Budget";
import BudgetService from "../../services/BudgetService";
import ClientsService from "../../services/ClientsService";
import ProjectService from "../../services/ProjectService";
import styles from "./Materials.module.css";

const budgetService = new BudgetService();
const projectService = new ProjectService();
const clientsService = new ClientsService();
const MOCK_API_BASE_URL = "http://localhost:3000";

interface MockProjectResponse {
  name?: string;
  clientId?: number;
  budget?: {
    materials?: BudgetMaterial[];
    subtotal?: number;
    totalCost?: number;
    discount?: number;
    discountType?: ValueType | "MOCK_TOTAL";
  };
}

interface MockClientResponse {
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  return digits.startsWith("55") ? digits : `55${digits}`;
}

function getSupplierNameFromUrl(url: string): string {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    return hostname || "Fornecedor sem nome";
  } catch {
    return "Fornecedor sem nome";
  }
}

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function buildPurchaseMessage(
  materials: BudgetMaterial[],
  clientName: string,
  projectName: string,
  subtotal: number,
  totalCost: number,
  discount: number,
  discountType: ValueType | "MOCK_TOTAL",
): string {
  const lines: string[] = [];

  lines.push(`Olá, ${clientName || "cliente"}!`);
  lines.push("");
  lines.push(
    `Aqui é da Solarway sobre o projeto ${projectName || "sem nome"}.`,
  );
  lines.push("");
  lines.push("Você precisa comprar os seguintes materiais:");
  lines.push("");
  lines.push(`Data: ${new Intl.DateTimeFormat("pt-BR").format(new Date())}`);
  lines.push("");

  let total = 0;

  materials.forEach((material, index) => {
    const itemTotal = material.unitPrice * material.quantity;
    total += itemTotal;

    lines.push(`${index + 1}. *${material.name}*`);
    lines.push(`Quantidade: ${material.quantity}`);
    lines.push(`Preço unitário: ${formatCurrency(material.unitPrice)}`);
    lines.push(`Subtotal do item: ${formatCurrency(itemTotal)}`);
    lines.push(`Link de compra: ${material.url}`);
    lines.push("");
  });

  const discountLabel =
    discountType === "PERCENT"
      ? `${discount.toLocaleString("pt-BR")} % (${formatCurrency((subtotal * discount) / 100)})`
      : formatCurrency(discount);

  lines.push(`Subtotal bruto: ${formatCurrency(subtotal || total)}`);
  lines.push(`Desconto aplicado: ${discountLabel}`);
  lines.push(`*Total final com desconto: ${formatCurrency(totalCost || total)}*`);

  return lines.join("\n");
}

function copyFallback(text: string): boolean {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";

  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  const successful = document.execCommand("copy");
  document.body.removeChild(textarea);

  return successful;
}

export default function Materials() {
  const { id } = useParams();
  const navigate = useNavigate();

  const projectId = id ? Number(id) : Number.NaN;

  const [loading, setLoading] = useState(true);
  const [materials, setMaterials] = useState<BudgetMaterial[]>([]);
  const [projectName, setProjectName] = useState("Projeto Solarway");
  const [budgetSubtotal, setBudgetSubtotal] = useState(0);
  const [budgetTotalCost, setBudgetTotalCost] = useState(0);
  const [budgetDiscount, setBudgetDiscount] = useState(0);
  const [budgetDiscountType, setBudgetDiscountType] = useState<ValueType | "MOCK_TOTAL">("AMOUNT");
  const [clientName, setClientName] = useState("cliente");
  const [clientPhone, setClientPhone] = useState("");
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState("");
  const [selectedMaterial, setSelectedMaterial] =
    useState<MaterialModalData | null>(null);

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      if (Number.isNaN(projectId)) {
        if (active) {
          setLoading(false);
        }
        return;
      }

      try {
        const loadedFromMainApi = await loadFromMainApi(projectId);

        if (!loadedFromMainApi) {
          await loadFromMockDb(projectId);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    async function loadFromMainApi(currentProjectId: number): Promise<boolean> {
      try {
        const budget = await budgetService.getProjectBudget(currentProjectId);
        const project = await projectService.getProjectById(
          String(currentProjectId),
        );

        if (budget && active) {
          setMaterials(budget.materials);
          setBudgetSubtotal(budget.subtotal);
          setBudgetTotalCost(budget.totalCost);
          setBudgetDiscount(budget.discount);
          setBudgetDiscountType(budget.discountType);
        }

        if (project?.name && active) {
          setProjectName(project.name);
        }

        if (project?.clientId) {
          const client = await clientsService.getClientById(project.clientId);
          if (active) {
            setClientName(
              client.name || `${client.firstName} ${client.lastName}`.trim(),
            );
            setClientPhone(client.phone);
          }
        }

        return Boolean(budget || project);
      } catch {
        return false;
      }
    }

    async function loadFromMockDb(currentProjectId: number) {
      const projectResponse = await fetch(
        `${MOCK_API_BASE_URL}/projects/${currentProjectId}`,
      );

      if (!projectResponse.ok) {
        return;
      }

      const projectData: MockProjectResponse = await projectResponse.json();

      if (active) {
        setProjectName(projectData.name || "Projeto Solarway");
        setMaterials(projectData.budget?.materials ?? []);
        setBudgetSubtotal(projectData.budget?.subtotal ?? 0);
        setBudgetTotalCost(projectData.budget?.totalCost ?? 0);
        setBudgetDiscount(projectData.budget?.discount ?? 0);
        setBudgetDiscountType(projectData.budget?.discountType ?? "AMOUNT");
      }

      if (!projectData.clientId) {
        return;
      }

      const clientResponse = await fetch(
        `${MOCK_API_BASE_URL}/clients/${projectData.clientId}`,
      );

      if (!clientResponse.ok) {
        return;
      }

      const clientData: MockClientResponse = await clientResponse.json();

      if (active) {
        const fullName =
          clientData.name ||
          `${clientData.firstName ?? ""} ${clientData.lastName ?? ""}`.trim();
        setClientName(fullName || "cliente");
        setClientPhone(clientData.phone ?? "");
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, [projectId]);

  const groupedMaterials = useMemo(() => {
    const map = new Map<string, MaterialModalData>();

    materials.forEach((material) => {
      const key = material.name.trim().toLowerCase();
      const supplierId = `${key}-${material.materialUrlId}`;
      const supplierName = getSupplierNameFromUrl(material.url);

      const current = map.get(key);

      if (current) {
        current.suppliers.push({
          id: supplierId,
          name: supplierName,
          url: material.url,
        });
        return;
      }

      map.set(key, {
        id: key,
        name: material.name,
        description: `Quantidade total prevista: ${material.quantity}`,
        category: "Material",
        suppliers: [
          {
            id: supplierId,
            name: supplierName,
            url: material.url,
          },
        ],
      });
    });

    return Array.from(map.values());
  }, [materials]);

  const hasMaterials = materials.length > 0;

  const generatedMessage = useMemo(() => {
    if (!hasMaterials) {
      return "";
    }

    return buildPurchaseMessage(
      materials,
      clientName,
      projectName,
      budgetSubtotal,
      budgetTotalCost,
      budgetDiscount,
      budgetDiscountType
    );
  }, [
    hasMaterials,
    materials,
    clientName,
    projectName,
    budgetSubtotal,
    budgetTotalCost,
    budgetDiscount,
    budgetDiscountType
  ]);

  const messageToUse = message || generatedMessage;

  async function handleCopyMessage() {
    if (!hasMaterials) {
      setFeedback("Não há materiais no orçamento para copiar.");
      return;
    }

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(messageToUse);
      setFeedback("Mensagem copiada para a área de transferência.");
      return;
    }

    const copied = copyFallback(messageToUse);
    setFeedback(
      copied
        ? "Mensagem copiada para a área de transferência."
        : "Não foi possível copiar a mensagem.",
    );
  }

  function handleOpenWhatsApp() {
    if (!hasMaterials) {
      setFeedback("Não há materiais no orçamento para enviar no WhatsApp.");
      return;
    }

    const phone = normalizePhone(clientPhone);

    if (!phone) {
      setFeedback("Telefone do cliente não encontrado para abrir o WhatsApp.");
      return;
    }

    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(messageToUse)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  function handleEditMaterial() {
    if (!id) {
      return;
    }

    navigate(`/projetos/${id}/orcamento`);
  }

  if (loading) {
    return (
      <PageLayout title="Materiais" backButton={true}>
        <div className={styles.emptyState}>Carregando materiais...</div>
      </PageLayout>
    );
  }

  if (Number.isNaN(projectId)) {
    return (
      <PageLayout title="Materiais" backButton={true}>
        <div className={styles.emptyState}>
          Para gerar lista de compra, abra a tela de materiais a partir de um
          projeto.
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Lista de Materiais"
      backButton={true}
      rightActions={
        <div className={styles.actions}>
          <button
            className={styles.whatsappButton}
            type="button"
            onClick={handleOpenWhatsApp}
          >
            <FontAwesomeIcon icon={faMessage} />
            Abrir no WhatsApp
          </button>

          <button
            className={styles.copyButton}
            type="button"
            onClick={handleCopyMessage}
          >
            <FontAwesomeIcon icon={faCopy} />
            Copiar mensagem
          </button>
        </div>
      }
    >
      <div className={styles.pageGrid}>
        <section className={styles.materialsCard}>
          <header className={styles.sectionHeader}>
            <h2>
              <FontAwesomeIcon icon={faFileLines} /> Materiais no orçamento
            </h2>
            <span>{materials.length} itens</span>
          </header>

          {groupedMaterials.length === 0 ? (
            <div className={styles.emptyState}>
              Nenhum material encontrado neste orçamento.
            </div>
          ) : (
            <div className={styles.materialsList}>
              {groupedMaterials.map((material) => (
                <button
                  className={styles.materialItem}
                  key={material.id}
                  type="button"
                  onClick={() => setSelectedMaterial(material)}
                >
                  <div>
                    <strong>{material.name}</strong>
                    <p>{material.suppliers.length} fornecedor(es)</p>
                  </div>
                  <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                </button>
              ))}
            </div>
          )}
        </section>

        <section className={styles.messageCard}>
          <header className={styles.sectionHeader}>
            <h2>Mensagem pronta para envio</h2>
            <span>
              {/* {clientPhone
                ? `WhatsApp: ${clientPhone}`
                : "Telefone não encontrado"} */}
            </span>
          </header>

          <textarea
            className={styles.messagePreview}
            value={messageToUse}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="A mensagem é gerada automaticamente com os materiais do orçamento."
          />

          {feedback ? <p className={styles.feedback}>{feedback}</p> : null}
        </section>
      </div>

      <MaterialModal
        isOpen={Boolean(selectedMaterial)}
        onClose={() => setSelectedMaterial(null)}
        material={selectedMaterial}
        onEdit={handleEditMaterial}
      />
    </PageLayout>
  );
}
