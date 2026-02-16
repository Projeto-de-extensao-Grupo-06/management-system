import type { JSX } from "react";

export default interface IconButtonProps {
    onClick?(): void;
    disabled?: boolean;
    type?: "submit" | "reset" | "button" | undefined;
    icon: JSX.Element;
    ariaLabel?: string;
    functionality?: "edit" | "delete";
    title?: string;
}