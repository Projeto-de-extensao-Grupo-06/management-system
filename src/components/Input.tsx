import './components.css';
import {InputProps} from '../interfaces/properties/InputProps';

export default function Input({placeholder, type = "text", onChange, value}: InputProps){
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