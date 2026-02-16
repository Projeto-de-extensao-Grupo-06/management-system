import type { Address } from "../interfaces/types/Client";

export function formatAddress(address: Address | null) {
    if(!address) {
        return "";
    }

    return `${address?.streetName} ${address?.number ?? ""} - ${address?.neighborhood}, ${address?.city} - ${address?.state} - ${address?.postalCode}`;
}