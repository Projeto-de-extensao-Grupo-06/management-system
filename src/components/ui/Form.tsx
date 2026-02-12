import './components.css';
import { faEye, faEyeSlash, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMask } from '@react-input/mask';
import { forwardRef, useEffect, useRef, useState } from 'react';
import type BaseInputProps from '../../interfaces/properties/BaseInputProps';
import type ButtonProps from '../../interfaces/properties/ButtonProps';
import type DocumentInputProps from '../../interfaces/properties/DocumentInputProps';
import type IconButtonProps from '../../interfaces/properties/IconButtonProps';
import type InputProps from '../../interfaces/properties/InputProps';
import type PasswordInputProps from '../../interfaces/properties/PasswordInputProps';
import type SelectProps from '../../interfaces/properties/SelectProps';

export function Button({ text, icon, type = "submit", onClick, disabled = false, ariaLabel, width, style, className }: ButtonProps) {
    return (
        <button
            type={type}
            className={`submit-button ${className || ''}`}
            disabled={disabled}
            onClick={onClick}
            aria-label={ariaLabel}
            style={{ width, ...style }}>
            {icon ? icon : ''} {text}
        </button>
    );
}

export function SimpleButton({ text, icon, type = "submit", onClick, disabled = false, ariaLabel, width }: ButtonProps) {
    return (
        <button
            type={type}
            className="simple-button"
            disabled={disabled}
            onClick={onClick}
            aria-label={ariaLabel}
            style={{ width }}>
            {icon ? icon : ''} {text}
        </button>
    );
}

export function IconButton({ functionality = "edit", icon, type = "submit", onClick, disabled = false, ariaLabel }: IconButtonProps) {
    return (
        <button
            type={type}
            className={`${functionality}-button`}
            disabled={disabled}
            onClick={onClick}
            aria-label={ariaLabel}>
            {icon}
        </button>
    );
}

export function SelectOption({ value, label }: { value: string, label: string }) {
    return (
        <option value={value}>{label}</option>
    );
}

export function Select({ children, value, onChange, className, style, id, name, disabled, onBlur }: SelectProps) {
    return (
        <select
            id={id}
            name={name}
            disabled={disabled}
            onBlur={onBlur}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`select ${className || ''}`}
            style={style}>
            {children}
        </select>
    );
}

export const Input = forwardRef<HTMLInputElement, BaseInputProps>(({ className, ...props }, ref) => {
    return (
        <div className="input-container">
            <input
                {...props}
                ref={ref}
                className={`input ${className || ''}`}
            />
        </div>
    );
});

export function SearchInput({ placeholder, type = "text", onChange, value }: InputProps) {
    return (
        <>
            <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="search-input" />
        </>
    );
}

export function PasswordInput({ placeholder, onChange, value }: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="input-container">
            <input
                type={showPassword ? 'text' : 'password'}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="input"
                required
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="input-icon" >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
        </div>
    );
}

const mergeRefs = (...refs: (React.Ref<HTMLInputElement> | undefined)[]) => (e: HTMLInputElement | null) => {
    refs.forEach((ref) => {
        if (typeof ref === 'function') ref(e);
        else if (ref != null && typeof ref === 'object' && 'current' in ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = e;
    });
};

export const PhoneInput = forwardRef<HTMLInputElement, BaseInputProps>((props, ref) => {
    const maskRef = useMask({
        mask: '(__) _____-____',
        replacement: { _: /\d/ },
    });

    return (
        <Input
            {...props}
            ref={mergeRefs(ref, maskRef)}
            type="tel"
            placeholder="(11) 98888-7777"
        />
    );
});

export const DocumentInput = forwardRef<HTMLInputElement, DocumentInputProps>(({ documentType = 'cpf', onChange, ...props }, ref) => {
    const cpfMaskRef = useMask({
        mask: '___.___.___-__',
        replacement: { _: /\d/ },
    });

    const cnpjMaskRef = useMask({
        mask: '__.___.___/____-__',
        replacement: { _: /\d/ },
    });

    const currentMaskRef = documentType === 'cnpj' ? cnpjMaskRef : cpfMaskRef;
    const placeholder = documentType === 'cnpj' ? '99.999.999/9999-99' : '999.999.999-99';

    const prevTypeRef = useRef(documentType);

    useEffect(() => {
        if (prevTypeRef.current !== documentType) {
            if (ref) {
                if (typeof ref === 'function') {
                    ref(null);
                } else if (ref && 'current' in ref && ref.current) {
                    ref.current.value = '';
                }
            }
            prevTypeRef.current = documentType;
        }
    }, [documentType, ref]);

    return (
        <Input
            {...props}
            onChange={onChange}
            ref={mergeRefs(ref, currentMaskRef)}
            type="text"
            placeholder={placeholder}
            maxLength={documentType === 'cnpj' ? 18 : 14}
        />
    );
});

export const CepInput = forwardRef<HTMLInputElement, BaseInputProps>((props, ref) => {
    const maskRef = useMask({
        mask: '_____-___',
        replacement: { _: /\d/ },
    });

    return (
        <Input
            {...props}
            ref={mergeRefs(ref, maskRef)}
            type="text"
            placeholder="01414-000"
            maxLength={9}
        />
    );
});