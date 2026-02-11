export default interface SelectProps {
    children: React.ReactNode;
    value: string;
    onChange(value: string): void;
    className?: string;
    style?: React.CSSProperties;
    id?: string;
    name?: string;
    disabled?: boolean;
    onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
}