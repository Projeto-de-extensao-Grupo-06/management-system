import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import OtpCodeInput from "../../../components/otpCodeInput/OtpCodeInput";
import { Alert } from '../../../components/ui/Alert';
import { Input, Button } from "../../../components/ui/Form";
import usePasswordRecoveryEmail from "../../../hooks/usePasswordRecoveryEmail";
import usePasswordRecoverySteps from "../../../hooks/usePasswordRecoverySteps";
import usePasswordRecoveryTimeRequestCode from "../../../hooks/usePasswordRecoveryTimeRequestCode";
import authService from "../../../services/AuthService";
import styles from "./ForgetPassword.module.css";

const auth = new authService();

export function ForgetPassword() {
    const [loading, setLoading] = useState(false);
    const { email, setEmail, clearEmail } = usePasswordRecoveryEmail();
    const [message, setMessage] = useState<string>("");
    const { step, updateStep, clearSteps } = usePasswordRecoverySteps();

    const [otpCode, setOtpCode] = useState("");
    const { timeToRequestNewCode, setTimeToRequestNewCode, clearTime } = usePasswordRecoveryTimeRequestCode();

    const requestRecoveryCode = async () => {
        try {
            await auth.requestRecoveryCode(email);
            updateStep("send-code");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.status === 429) {
                    setMessage("Aguarde um minuto para solicitar um novo token.");
                } else {
                    setMessage("Falha ao enviar e-mail, tente novamente mais tarde.")
                }
            }
        }
    }

    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        requestRecoveryCode();
    }

    const requestNewCode = () => {
        if (timeToRequestNewCode === 0) {
            requestRecoveryCode();
            setTimeToRequestNewCode(60);
        }
    }

    useEffect(() => {
        const handleOtpCode = async () => {
            if (otpCode.length === 6) {
                setLoading(true);

                try {
                    await auth.verifyOtpCode({
                        email: email,
                        otp: otpCode
                    });
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        if (error.status === 401) {
                            setMessage("Código de verificação incorreto...");
                            setOtpCode("");
                        } else if (error.status !== 204) {
                            setMessage("Erro ao verificar código...");
                            setOtpCode("");
                        }
                    }
                }



                setLoading(false);
            }
        }

        handleOtpCode();
    }, [otpCode]);


    useEffect(() => {
        const resetMessage = () => {
            setMessage("");
        }

        resetMessage();
    }, [step]);

    useEffect(() => {
        if (timeToRequestNewCode <= 0) return;

        const interval = setInterval(() => {
            setTimeToRequestNewCode(timeToRequestNewCode - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timeToRequestNewCode]);

    return (
        <>
            <form className={`${styles.form} ${step !== "send-email" ? styles.outScreenRigth : ""}`} onSubmit={handleEmailSubmit}>
                <span className={styles.infoText}>Informe o email associado a sua conta para redefinir a senha.</span>
                <Alert message={message} type="error" />
                <Input placeholder="exemplo@email.com" type="email" value={email} onChange={setEmail} />

                <Button text="Enviar Código de Recuperação" />

                <Link className={styles.loginLink} to="/login" onClick={() => clearSteps()}>Voltar para a tela de login</Link>
            </form>

            <form className={`${styles.form} ${step === "send-email" ? styles.outScreenLeft : step === "send-code" ? styles.inScreen : ""} ${step === "change-password" ? styles.outScreenLeft : ""}`}>
                <span className={styles.infoText}>Informe o código de verificação enviado para {email}.</span>
                <Alert message={message} type="error" />
                <OtpCodeInput valueState={{ value: otpCode, setValue: setOtpCode }} disabled={loading} />

                <span onClick={requestNewCode} style={{ color: timeToRequestNewCode > 0 ? "#1b5e1fbb" : "" }} className={styles.requestNewCode}>Solicitar novo código {timeToRequestNewCode === 0 ? "" : `em ${timeToRequestNewCode}s`}</span>
                <Link className={styles.loginLink} to="/login" onClick={() => { clearSteps(); clearEmail(); clearTime(); }}>Voltar para a tela de login</Link>
            </form>

            {
                loading &&
                <span className="loader"></span>
            }
        </>
    );
}