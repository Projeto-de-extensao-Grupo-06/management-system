import type Client from "../../interfaces/types/Client";

class ClientMapper {
    toDomain(client: Client): Client {
        return {
            ...client,
            name: `${client.firstName} ${client.lastName}`,
        };
    }
}

export default new ClientMapper();
