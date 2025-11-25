export default interface ButtonProps = {
    onClick?(): void;
    text: string;
    disabled?: boolean;
    type?: string;
}
