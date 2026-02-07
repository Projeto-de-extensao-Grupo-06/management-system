import { useRef, useState } from "react";
import type OtpCodeInputProps from "../../interfaces/properties/OtpCodeInputProps";
import InputBlock from "./partials/InputBlock";
import "./OtpCodeInput.css"

export default function OtpCodeInput({ valueState: { value, setValue }, disabled }: OtpCodeInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [cursorIndex, setCursorIndex] = useState<number | null>(null);

    const updateCursor = () => {
        if (!inputRef.current) return;
        setCursorIndex(inputRef.current.selectionStart);
    };

    return (
        <>
            <input
                className="hiddenInput"
                inputMode="numeric"
                autoComplete="one-time-code"
                data-bwignore="true"
                data-1p-ignore="true"
                data-lpignore="true"
                type="text"
                ref={inputRef}
                tabIndex={-1}
                value={value}
                maxLength={6}
                onChange={(e) => {
                    const iptValue = e.target.value;
                    const regex = /^\d*$/

                    if (regex.test(iptValue)) {
                        setValue(iptValue);
                    }

                    updateCursor();
                }}
                onClick={updateCursor}
                onKeyUp={updateCursor}
                onBlur={() => setCursorIndex(null)}
                disabled={disabled}
            />

            <div className="inputContainer">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                    <InputBlock
                        key={i}
                        value={value[i]}
                        focus={cursorIndex === i}
                        onclick={() => {
                            inputRef.current?.focus();
                            inputRef.current?.setSelectionRange(i, i);
                            setCursorIndex(i);
                        }}
                    />
                ))}
            </div>
        </>
    );
}
