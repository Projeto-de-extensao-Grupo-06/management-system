export default interface SelectProps {
    children: React.ReactNode;
    value: string;
    onChange(value: string): void;
    className?: string;
    style?: React.CSSProperties;
}