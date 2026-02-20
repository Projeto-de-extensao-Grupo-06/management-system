export default interface CalendarEvent {
    id: string;
    title: string;
    start: string;
    end?: string;
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
    extendedProps?: {
        type: 'VISIT' | 'INSTALLATION' | 'REMINDER';
        description?: string;
        clientName?: string;
        time?: string;
    };
}
