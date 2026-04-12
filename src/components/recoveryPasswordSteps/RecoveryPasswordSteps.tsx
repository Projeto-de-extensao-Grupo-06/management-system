import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link } from "react-router";
import type { Steps } from "../../interfaces/types/ForgetPasswordSteps";
import OtpCodeInput from "../otpCodeInput/OtpCodeInput";
import PasswordCreationValidator from "../passwordCreationValidator/PasswordCreationValidator";
import { Alert } from "../ui/Alert";
import { Button, Input, PasswordInput } from "../ui/Form";
import styles from "./RecoveryPasswordSteps.module.css";


interface SendEmailStepProps {
    step: Steps;
    handleEmailSubmit: (e: React.FormEvent) => void;
    message: string;
    email: string;
    setEmail: (email: string) => void;
    clearSteps: () => void;
    clearEmail: () => void;
    clearTime: () => void;
}

interface SendCodeStepProps {
    step: Steps;
    message: string;
    otpCode: string;
    timeToRequestNewCode: number;
    requestNewCode: () => void;
    setOtpCode: React.Dispatch<React.SetStateAction<string>>;
    loading: boolean;
    email: string;
    clearSteps: () => void;
    clearEmail: () => void;
    clearTime: () => void;
}

interface ChangePasswordStepProps {
    step: Steps;
    message: string;
    clearSteps?: () => void;
    clearEmail?: () => void;
    clearTime?: () => void;
    password: string;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
    handlePasswordChange: (e: React.FormEvent) => void;
    messageType: "error" | "success" | "warning" | undefined;
    hideLoginLink?: boolean;
}


export function SendEmailStep({ step, handleEmailSubmit, message, clearSteps, email, setEmail, clearEmail, clearTime }: SendEmailStepProps) {
    return (
        <form className={`${styles.form} ${step !== "send-email" ? styles.outScreenRigth : ""}`} onSubmit={handleEmailSubmit}>
            <span className={styles.infoText}>Informe o email associado a sua conta para redefinir a senha.</span>
            <Alert message={message} type="error" />
            <Input placeholder="exemplo@email.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

            <Button text="Enviar Código de Recuperação" />

            <Link className={styles.loginLink} to="/login" onClick={() => { clearSteps(); clearEmail(); clearTime(); }}>Voltar para a tela de login</Link>
        </form>
    );
}


export function SendCodeStep({ message, step, otpCode, requestNewCode, timeToRequestNewCode, setOtpCode, loading, email, clearEmail, clearSteps, clearTime }: SendCodeStepProps) {
    return (
        <form className={`${styles.form} ${step === "send-email" ? styles.outScreenLeft : step === "send-code" ? styles.inScreen : ""} ${step === "change-password" ? styles.outScreenRigth : ""}`}>
            <span className={styles.infoText}>Informe o código de verificação enviado para {email}.</span>
            <Alert message={message} type="error" />
            <OtpCodeInput valueState={{ value: otpCode, setValue: setOtpCode }} disabled={loading} />

            <span onClick={() => requestNewCode()} style={{ color: timeToRequestNewCode > 0 ? "#1b5e1fbb" : "" }} className={styles.requestNewCode}>Solicitar novo código {timeToRequestNewCode === 0 ? "" : `em ${timeToRequestNewCode}s`}</span>
            <Link className={styles.loginLink} to="/login" onClick={() => { clearSteps(); clearEmail(); clearTime(); }}>Voltar para a tela de login</Link>
        </form>
    );
}

export function ChangePasswordStep({ message, step, clearEmail, clearSteps, clearTime, password, setPassword, handlePasswordChange, messageType, hideLoginLink }: ChangePasswordStepProps) {
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordValid, setPasswordValid] = useState(false);

    const isPasswordEqualsPasswordConfirm = password === confirmPassword && password !== "";

    const [passwordChanged, setPasswordChanged] = useState(false);

    return (
        <form onSubmit={(e) => { setPasswordChanged(true); handlePasswordChange(e); }} className={`${styles.form} ${step === "send-email" || step === "send-code" ? styles.outScreenLeft : step === "change-password" ? styles.inScreen : ""}`}>
            <span className={styles.infoText}>Crie uma senha para acessar sua conta</span>
            <Alert message={message} type={messageType} />

            <div className={styles.passwordInputsContainer}>
                <div className={styles.inputLabelContent}>
                    <label className={styles.infoText}>Nova senha</label>
                    <PasswordInput onChange={setPassword} value={password} placeholder="Digite sua senha..." />

                    <PasswordCreationValidator password={password} onValidityChange={setPasswordValid} />
                </div>
                {
                    passwordValid &&
                    <div className={styles.inputLabelContent}>
                        <label className={styles.infoText}>Confirmar Senha</label>
                        <PasswordInput onChange={setConfirmPassword} value={confirmPassword} placeholder="Digite sua senha..." />
                        {!isPasswordEqualsPasswordConfirm && <span className={styles.confirmPassNotEquals}><FontAwesomeIcon icon={faX} /> Senhas não coincidem</span>}
                    </div>
                }
            </div>

            <span className={styles.infoText}>Deve conter pelo menos 8 caracteres (Letras, números ou símbolos)</span>
            <Button text="Alterar Senha" disabled={!isPasswordEqualsPasswordConfirm || passwordChanged} />

            {!hideLoginLink && (
                <Link className={styles.loginLink} to="/login" onClick={() => { clearSteps?.(); clearEmail?.(); clearTime?.(); }}>Voltar para a tela de login</Link>
            )}
        </form>
    );
}