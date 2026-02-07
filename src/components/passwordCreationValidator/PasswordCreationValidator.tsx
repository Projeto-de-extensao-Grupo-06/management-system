import { faCheck, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useMemo } from "react";
import styles from "./PasswordCreationValidator.module.css";


interface PasswordCreationValidatorProps {
    password: string;
    onValidityChange: (valid: boolean) => void;
}


const PasswordCreationValidator = (({ password, onValidityChange }: PasswordCreationValidatorProps) => {
    const containsUpperCase = /[A-Z]/.test(password);
    const containsLowerCase = /[a-z]/.test(password);
    const containsNumber = /[0-9]/.test(password);
    const containsSpecialCharacter = /[^A-Za-z0-9]/.test(password);
    const containsEightCharacter = password.length >= 8;

    const valid = useMemo(() => {
        return (
            containsUpperCase &&
            containsLowerCase &&
            containsNumber &&
            containsSpecialCharacter &&
            containsEightCharacter
        );
    }, [
        containsUpperCase,
        containsLowerCase,
        containsNumber,
        containsSpecialCharacter,
        containsEightCharacter
    ]);

    useEffect(() => {
        onValidityChange(valid);
    }, [valid, onValidityChange]);

    return (
        <div className={styles.container}>
            {
                !valid &&
                <>
                    <p className={containsUpperCase ? styles.ok : styles.error}>
                        <FontAwesomeIcon icon={containsUpperCase ? faCheck : faX} /> Contém letra maiúscula
                    </p>
                    <p className={containsLowerCase ? styles.ok : styles.error}>
                        <FontAwesomeIcon icon={containsLowerCase ? faCheck : faX} /> Contém letra minúscula
                    </p>
                    <p className={containsNumber ? styles.ok : styles.error}>
                        <FontAwesomeIcon icon={containsNumber ? faCheck : faX} /> Contém número
                    </p>
                    <p className={containsSpecialCharacter ? styles.ok : styles.error}>
                        <FontAwesomeIcon icon={containsSpecialCharacter ? faCheck : faX} /> Contém caractere especial
                    </p>
                    <p className={containsEightCharacter ? styles.ok : styles.error}>
                        <FontAwesomeIcon icon={containsEightCharacter ? faCheck : faX} /> Contém no mínimo 8 caracteres
                    </p>
                </>
            }

            {
                valid &&
                <p className={styles.ok}>
                    <FontAwesomeIcon icon={faCheck} /> Senha Segura
                </p>
            }
        </div>
    );
});

export default PasswordCreationValidator;
