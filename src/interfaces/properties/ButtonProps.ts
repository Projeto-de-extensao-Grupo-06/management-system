import type { JSX } from "react";

export default interface ButtonProps {
    onClick?(): void;
    text: string;
    disabled?: boolean;
    type?: "submit" | "reset" | "button" | undefined;
    icon?: JSX.Element;
    ariaLabel?: string;
    width?: string | number;
    style?: React.CSSProperties;
}
