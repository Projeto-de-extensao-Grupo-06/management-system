import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import type { Budget } from "../../../interfaces/types/Budget";
import AddressService from "../../../services/AddressService";
import ClientsService from "../../../services/ClientsService";
import { CoworkerService } from "../../../services/CoworkerService";
import ProjectService from "../../../services/ProjectService";
import { formatAddress } from "../../../utils/AddressUtils";
import Modal from "../../dialogs/modal/Modal";
import ProposalPage from "../../pdf/ProposalPage";
import TogglePercentAmountAndMock from "../partials/TogglePercentAmountAndMock";
import styles from "./BudgetSummary.module.css";

interface Props {
    budget: Budget;
    setBudget: React.Dispatch<React.SetStateAction<Budget>>
    editing: boolean;
    setEditing: React.Dispatch<React.SetStateAction<boolean>>;
    projectId: number;
}

const projectsService = new ProjectService();
const clientsService = new ClientsService();
const coworkerService = new CoworkerService();
const addressService = new AddressService();

export default function BudgetSummary({ budget, editing, setEditing, setBudget, projectId }: Props) {
    const [modalOpen, setModalOpen] = useState(false);
    const [clientName, setClientName] = useState<string | null>(null);
    const [clientPhone, setClientPhone] = useState<string | null>(null);
    const [clientDoc, setClientDoc] = useState<string | null>(null);
    const [installEmail, setInstallEmail] = useState<string | null>(null);
    const [installAddress, setInstallAddress] = useState<string | null>(null);
    const [installCity, setInstallCity] = useState<string | null>(null);
    const [consultantName, setConsultantName] = useState<string | null>(null);
    const [consultantEmail, setConsultantEmail] = useState<string | null>(null);

    async function handleBudgetPdfData() {
        const project = await projectsService.getProjectById(projectId.toString());
        const client = await clientsService.getClientById(project?.clientId || 0);
        const consultant = await coworkerService.getCoworkerById(project?.coworkerId || 0);
        const address = await addressService.getAddressById(project?.addressId || 0);

        setClientName(client?.name);
        setClientPhone(client?.phone);
        setClientDoc(client?.documentNumber);
        setInstallEmail(client?.email);
        setInstallAddress(formatAddress(address));
        setInstallCity(address?.city);
        setConsultantName(consultant?.firstName + " " + consultant?.lastName);
        setConsultantEmail(consultant?.email);
    }

    useEffect(() => {
        if (modalOpen) {
            void (async () => {
                await handleBudgetPdfData();
            })();
        }
    }, [modalOpen]);


    function formatCurrency(value?: number) {
        if (!value) return "R$ 0,00";

        return value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    }

    const pdfRef = useRef(null);
    const handleBudgetPdfDownload = useReactToPrint({
        contentRef: pdfRef,
        documentTitle: "proposta",
    });

    if (budget.id === 0) {
        return <span>Carregando...</span>
    }


    return (
        <div className={styles.container}>

            <div className={styles.header}>
                <h2>Fechamento Financeiro</h2>
            </div>

            <div className={styles.formRow}>
                <div className={styles.field}>
                    <label className={styles.label}>Desconto</label>

                    <div className={styles.discountContent}>
                        <input
                            className={styles.input}
                            type="text"
                            value={budget.discount}
                            onChange={(e) =>
                                setBudget((prev) => {
                                    const value = e.target.value;

                                    const numberRegex = /^\d*\.?\d*$/;

                                    if (!numberRegex.test(value)) {
                                        return prev;
                                    }

                                    return {
                                        ...prev,
                                        discount: value === "" ? 0 : Number(value),
                                    };
                                })
                            }
                            disabled={!editing}
                        />

                        <TogglePercentAmountAndMock
                            onChange={(v) => {
                                setBudget((prev) => {
                                    return {
                                        ...prev,
                                        discountType: v
                                    }
                                })
                            }}
                            value={budget.discountType}
                            editing={editing}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.subtotalRow}>
                <span className={styles.subtotalLabel}>Subtotal</span>

                <div className={styles.subtotalValue}>
                    {formatCurrency(budget?.subtotal)}
                </div>
            </div>

            <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Preço Final</span>

                <div className={styles.totalValue}>
                    {formatCurrency(budget?.totalCost)}
                </div>
            </div>

            <div className={styles.actions}>
                <button className={styles.saveButton} onClick={() => setEditing(!editing)}>{editing ? "Salvar" : "Editar"}</button>

                <button className={styles.buyListButton}>
                    Gerar Lista de Compras
                </button>

                <button className={styles.pdfButton} onClick={() => setModalOpen(true)}>
                    Baixar PDF
                </button>

                <button className={styles.botButton}>Enviar via Bot</button>
            </div>


            <Modal isOpen={modalOpen} title="Download de Orçamento em PDF" onClose={() => setModalOpen(false)}>
                <div className={styles.modalContent}>
                    {
                        (
                            clientName &&
                            clientPhone &&
                            clientDoc &&
                            installEmail &&
                            installAddress &&
                            installCity &&
                            consultantName &&
                            consultantEmail
                        ) ? (
                            <>
                                <div className={styles.actionsModal}>
                                    <button className={styles.pdfButtonDownload} onClick={() => handleBudgetPdfDownload()}>
                                        Baixar PDF
                                    </button>
                                </div>
                                <ProposalPage
                                    ref={pdfRef}
                                    clientName={clientName}
                                    clientPhone={clientPhone}
                                    clientDoc={clientDoc}
                                    installEmail={installEmail}
                                    installAddress={installAddress}
                                    installCity={installCity}
                                    projectId={projectId}
                                    consultantName={consultantName}
                                    consultantEmail={consultantEmail}
                                    budget={budget}
                                />
                            </>
                        ) :
                            <div className={styles.loaderContainer}>
                                <span className={styles.loader}></span>
                                <span>Gerando PDF...</span>
                            </div>
                    }
                </div>
            </Modal>
        </div>
    );
}