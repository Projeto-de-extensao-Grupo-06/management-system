import type InputBlockProps from "../../../interfaces/properties/InputBlock";
import "../OtpCodeInput.css";

export default function InputBlock({ value, onclick, focus }: InputBlockProps) {
    return (
        <div className={`block ${focus ? "focus" : ""}`} onClick={onclick}>
            <span>{value}</span>
        </div>
    );
}