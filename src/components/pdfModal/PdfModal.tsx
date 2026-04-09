import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import type { Budget } from "../../interfaces/types/Budget";
import AddressService from "../../services/AddressService";
import ClientsService from "../../services/ClientsService";
import CoworkerService from "../../services/CoworkerService";
import ProjectService from "../../services/ProjectService";
import { formatAddress } from "../../utils/AddressUtils";
import Modal from "../dialogs/modal/Modal";
import ProposalPage from "../pdf/ProposalPage";
import styles from "./PdfModal.module.css";

interface Props {
  projectId: number;
  budget: Budget;
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const projectsService = new ProjectService();
const clientsService = new ClientsService();
const coworkerService = new CoworkerService();
const addressService = new AddressService();

export default function PdfModal({
  projectId,
  budget,
  modalOpen,
  setModalOpen,
}: Props) {
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
    const consultant = await coworkerService.getCoworkerById(
      project?.coworkerId || 0,
    );
    const address = await addressService.getAddressById(
      project?.addressId || 0,
    );

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

  const pdfRef = useRef(null);
  const handleBudgetPdfDownload = useReactToPrint({
    contentRef: pdfRef,
    documentTitle: "proposta",
  });

  return (
    <Modal
      isOpen={modalOpen}
      title="Download de Orçamento em PDF"
      onClose={() => setModalOpen(false)}
    >
      <div className={styles.modalContent}>
        {clientName &&
        clientPhone &&
        clientDoc &&
        installEmail &&
        installAddress &&
        installCity &&
        consultantName &&
        consultantEmail ? (
          <>
            <div className={styles.actionsModal}>
              <button
                className={styles.pdfButtonDownload}
                onClick={() => handleBudgetPdfDownload()}
              >
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
        ) : (
          <div className={styles.loaderContainer}>
            <span className={styles.loader}></span>
            <span>Gerando PDF...</span>
          </div>
        )}
      </div>
    </Modal>
  );
}
