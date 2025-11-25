import './components.css';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import {PasswordInputProps} from '../interfaces/properties/PasswordInputProps';

export default function Input({placeholder, onChange, value}: PasswordInputProps){
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
                onClick={() => setShowPassword(!mostrarSenha)}
                className="input-icon" >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
        </div>
    );
}