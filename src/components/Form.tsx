import './components.css';

import type IconButtonProps from '../interfaces/properties/IconButtonProps';
import type ButtonProps from '../interfaces/properties/ButtonProps';
import type InputProps from '../interfaces/properties/InputProps';
import type PasswordInputProps from '../interfaces/properties/PasswordInputProps';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import type SelectProps from '../interfaces/properties/SelectProps';

export function Button ({text, icon, type="submit", onClick, disabled=false, ariaLabel}: ButtonProps){
    return (
        <button 
            type={type}
            className="submit-button" 
            disabled={disabled}
            onClick={onClick}
            aria-label={ariaLabel}>
            {icon ? icon : ''} {text}
        </button>
    );
}

export function SimpleButton ({text, icon, type="submit", onClick, disabled=false, ariaLabel}: ButtonProps){
    return (
        <button 
            type={type}
            className="simple-button" 
            disabled={disabled}
            onClick={onClick}
            aria-label={ariaLabel}>
            {icon ? icon : ''} {text}
        </button>
    );
}

export function IconButton ({functionality="edit", icon, type="submit", onClick, disabled=false}: IconButtonProps){
    return (
        <button 
            type={type}
            className={`${functionality}-button`} 
            disabled={disabled}
            onClick={onClick}>
            {icon}
        </button>
    );
}

export function SelectOption({value, label}: {value: string, label: string}){
    return (
        <option value={value}>{label}</option>
    );
}

export function Select({children, value, onChange}: SelectProps){
    return (
        <select 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            className="select">
            {children}
        </select>
    );
}

export function Input({placeholder, type = "text", onChange, value}: InputProps){
    return (
        <div className="input-container">
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="input"
                required
            />
        </div>
    );
}

export function PasswordInput({placeholder, onChange, value}: PasswordInputProps){
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