import './components.css';
import { faEye, faEyeSlash, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { forwardRef, useState } from 'react';
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

export const PhoneInput = forwardRef<HTMLInputElement, BaseInputProps>(
  ({ value, onChange, ...props }, ref) => {

    const formatPhone = (value: string) => {
      const numbers = value.replace(/\D/g, '').slice(0, 11);

      if (numbers.length <= 10) {
        return numbers
          .replace(/(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{4})(\d)/, '$1-$2');
      }

      return numbers
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatPhone(e.target.value);

      e.target.value = formatted;
      onChange?.(e);
    };

    return (
      <Input
        {...props}
        ref={ref}
        value={value || ''}
        onChange={handleChange}
        type="tel"
        placeholder="(11) 98888-7777"
        maxLength={15}
      />
    );
  }
);


export const DocumentInput = forwardRef<HTMLInputElement, DocumentInputProps>(
  ({ documentType = 'cpf', value, onChange, ...props }, ref) => {

    const formatCPF = (value: string) => {
      return value
        .replace(/\D/g, '')
        .slice(0, 11)
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    };

    const formatCNPJ = (value: string) => {
      return value
        .replace(/\D/g, '')
        .slice(0, 14)
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;

      const formatted =
        documentType === 'cnpj'
          ? formatCNPJ(rawValue)
          : formatCPF(rawValue);

      e.target.value = formatted;

      onChange?.(e);
    };

    const placeholder =
      documentType === 'cnpj'
        ? '99.999.999/9999-99'
        : '999.999.999-99';

    return (
      <Input
        {...props}
        ref={ref}
        value={value || ''}
        onChange={handleChange}
        type="text"
        placeholder={placeholder}
      />
    );
  }
);

export const CepInput = forwardRef<HTMLInputElement, BaseInputProps>(
  ({ value, onChange, ...props }, ref) => {

    const formatCEP = (value: string) => {
      return value
        .replace(/\D/g, '')
        .slice(0, 8)
        .replace(/(\d{5})(\d)/, '$1-$2');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      const formatted = formatCEP(rawValue);

      e.target.value = formatted;
      onChange?.(e);
    };

    return (
      <Input
        {...props}
        ref={ref}
        value={value || ''}
        onChange={handleChange}
        type="text"
        placeholder="01414-000"
        maxLength={9}
      />
    );
  }
);
