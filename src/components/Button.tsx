import './components';
import {ButtonProps} from '../interfaces/properties/ButtonProps';

export default function Button ({text, type="submit", onClick, disabled=false}: ButtonProps){
    return (
        <button 
            type="submit" 
            className="submit-button" 
            disabled={disabled}
            onClick={onClick}>
            {text}
        </button>
    );
}