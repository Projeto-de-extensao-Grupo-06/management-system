export default interface CalendarEvent {
    id: string;
    title: string;
    start: string;
    end?: string;
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
    extendedProps?: {
        type: 'TECHNICAL_VISIT' | 'INSTALL_VISIT' | 'NOTE';
        description?: string;
        clientName?: string;
        time?: string;
    };
}
