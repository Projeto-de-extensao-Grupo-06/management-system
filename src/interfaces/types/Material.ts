export interface Material {
    id: number;
    name: string;
    description: string | null;
    metric: "UNIT" | "METER" | "CENTIMETER";
}

export interface MaterialUrl {
    id: number;
    url: string;
    price: number;
}