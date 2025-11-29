export default interface SelectProps {
    children: React.ReactNode;
    value: string;
    onChange(value: string): void;
}