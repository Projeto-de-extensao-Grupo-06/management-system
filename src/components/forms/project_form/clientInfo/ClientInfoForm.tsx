import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Link } from "react-router";
import type { Address } from "../../../../interfaces/types/Client";
import type Client from "../../../../interfaces/types/Client";
import type { ProjectDetails } from "../../../../interfaces/types/ProjectDetails";
import AddressService from "../../../../services/AddressService";
import ClientsService from "../../../../services/ClientsService";
import { formatAddress } from "../../../../utils/AddressUtils";
import Modal from "../../../dialogs/modal/Modal";
import GoogleMaps from "../../../maps/GoogleMaps";
import SecureComponent from "../../../security/SecureComponent";
import { Input } from "../../../ui/Form";
import { Button } from "../../../ui/Form";
import AddressForm from "../../client_form/partials/AddressForm";
import styles from "./ClientInfo.module.css";

interface ClientInfoFormProps {
    project: ProjectDetails;
}

const clientService = new ClientsService();
const addressService = new AddressService();

export default function ClientInfoForm({ project }: ClientInfoFormProps) {
    const [client, setClient] = useState<Client>();
    const [address, setAddress] = useState<Address | null>(null);
    const textAddress = formatAddress(address);
    const [editAddress, setEditAddress] = useState(false);
    const methods = useForm({
        defaultValues: {
            zipCode: "",
            state: "",
            city: "",
            neighborhood: "",
            street: "",
            number: ""
        }
    });

    useEffect(() => {
        const loadClient = async () => {
            const client = await clientService.getClientById(project.addressId);
            setClient(client);
            const address = await addressService.getAddressById(project.addressId);
            setAddress(address);

            methods.reset({
                zipCode: address?.postalCode,
                state: address?.state,
                city: address?.city,
                neighborhood: address?.neighborhood,
                street: address?.streetName,
                number: address?.number
            });
        }

        loadClient();
    }, [editAddress]);

    const useClientAddress = () => {
        methods.reset({
            zipCode: client?.mainAddress?.postalCode,
            number: client?.mainAddress?.number
        });
    }

    const handleModalClose = () => {
        setEditAddress(false);
        methods.reset({
            zipCode: address?.postalCode,
            state: address?.state,
            city: address?.city,
            neighborhood: address?.neighborhood,
            street: address?.streetName,
            number: address?.number
        });
    }

    const handleAddressSave = async () => {
        const formValues = methods.getValues();
        await addressService.updateAddress(project.addressId, {
            postalCode: formValues.zipCode,
            streetName: formValues.street,
            neighborhood: formValues.neighborhood,
            number: formValues.number,
            city: formValues.city,
            state: formValues.state
        });

        setEditAddress(false);
    }

    return (
        <div>
            <div className={styles.infoContainer}>
                <div className={styles.infoIconAndText}>
                    <FontAwesomeIcon icon={faUser} color="black" size="xl" />
                    <span className={styles.infoText}>  Cliente</span>
                </div>
                <SecureComponent permissions={["CLIENT_UPDATE"]}>
                    <Link className={styles.editClient} to={`/clientes/${project.clientId}`}>Editar Cliente</Link>
                </SecureComponent>
            </div>

            <div className={styles.form}>
                <div className={styles.inputContainer}>
                    <label className={styles.inputLabel}>Nome do projeto:</label>
                    <Input disabled={true} value={client?.name ?? ""} />
                </div>
                <div className={styles.inputContainer}>
                    <label className={styles.inputLabel}>Endereço:</label>
                    <div>
                        <Input disabled={true} value={textAddress ?? ""} />
                        <SecureComponent permissions={["PROJECT_UPDATE"]}>
                            <span className={styles.editAddress} onClick={() => setEditAddress(true)}>Editar Endereço</span>
                        </SecureComponent>
                    </div>
                    <div className={styles.map}>
                        {textAddress && <GoogleMaps address={textAddress} />}
                    </div>

                    <Modal isOpen={editAddress} title="Editar endereço" onClose={handleModalClose}>
                        <FormProvider {...methods}>
                            <AddressForm />
                        </FormProvider>

                        {client?.mainAddress && <span className={styles.editAddress} onClick={useClientAddress}>Usar o endereço do cliente</span>}
                        <Button style={{ marginTop: "30px" }} text="Salvar" onClick={handleAddressSave} />
                    </Modal>
                </div>
            </div>
        </div>
    );
}