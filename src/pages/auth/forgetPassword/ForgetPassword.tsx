import { useState } from "react";
import { Input, Button } from "../../../components/ui/Form";
import styles from "./ForgetPassword.module.css";
// import { Alert } from '../../../components/ui/Alert';
import { Link } from "react-router";
import type { Steps } from "../../../interfaces/types/ForgetPasswordSteps";
import usePasswordRecoverySteps from "../../../hooks/usePasswordRecoverySteps";
import authService from "../../../services/AuthService";

const auth = new authService();

export function ForgetPassword() {
    const [email, setEmail] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const {step, updateStep, clearSteps} = usePasswordRecoverySteps();

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        await auth.requestRecoveryCode(email);
        
        setMessage("E-mail enviado com sucesso");
        updateStep("send-code");
    }

    return (
        <>
            <form className={`${styles.form} ${step !== "send-email" ? styles.outScreenLeft : ""}`} onSubmit={handleEmailSubmit}>
                <span className={styles.infoText}>Informe o email associado a sua conta para redefinir a senha.</span>
                <Input placeholder="exemplo@email.com" type="email" value={email} onChange={setEmail}/>

                <Button text="Enviar Código de Recuperação"/>
                
                <Link className={styles.loginLink} to="/login">Voltar para a tela de login</Link>
            </form>
        </>
    );
}