export default interface InputProps {
    placeholder: string;
    type?: string;
    onChange(value: string): void;
    value: string;
    maxLength?: number;
}