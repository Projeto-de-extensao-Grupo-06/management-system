export interface Schedule {
    id: number;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    notificationDate: string;
    type: "TECHNICAL_VISIT" | "INSTALL_VISIT" | "NOTE";
    status: "MARKED" | "IN_PROGRESS" | "FINISHED";
    isActive: boolean;
    projectId: number;
    coworkerId: number
}
