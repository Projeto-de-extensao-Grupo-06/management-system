import './components.css';

import type ButtonProps from '../interfaces/properties/ButtonProps';
import type InputProps from '../interfaces/properties/InputProps';
import type PasswordInputProps from '../interfaces/properties/PasswordInputProps';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export function Button ({text, type="submit", onClick, disabled=false}: ButtonProps){
    return (
        <button 
            type={type}
            className="submit-button" 
            disabled={disabled}
            onClick={onClick}>
            {text}
        </button>
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