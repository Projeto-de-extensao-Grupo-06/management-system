import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { SendCodeStep, SendEmailStep, ChangePasswordStep } from '../../../components/recoveryPasswordSteps/RecoveryPasswordSteps';
import usePasswordRecoveryEmail from "../../../hooks/usePasswordRecoveryEmail";
import usePasswordRecoverySteps from "../../../hooks/usePasswordRecoverySteps";
import usePasswordRecoveryTimeRequestCode from "../../../hooks/usePasswordRecoveryTimeRequestCode";
import authService from "../../../services/AuthService";

const auth = new authService();

export function ForgetPassword() {
    const [loading, setLoading] = useState(false);
    const { email, setEmail, clearEmail } = usePasswordRecoveryEmail();
    const emailRef = useRef(email);

    const [message, setMessage] = useState<string>("");
    const [messageType, setMessageType] = useState<"error" | "success" | "warning" | undefined>("error");

    const { step, updateStep, clearSteps } = usePasswordRecoverySteps();

    const [otpCode, setOtpCode] = useState("");
    const { timeToRequestNewCode, setTimeToRequestNewCode, clearTime } = usePasswordRecoveryTimeRequestCode();

    const [password, setPassword] = useState("");

    const requestRecoveryCode = async () => {
        try {
            await auth.requestRecoveryCode(emailRef.current);
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
        if (timeToRequestNewCode === 0) {
            requestRecoveryCode();
            setTimeToRequestNewCode(60);
        }
    }

    const requestNewCode = () => {
        console.log(timeToRequestNewCode)
        if (timeToRequestNewCode === 0) {
            requestRecoveryCode();
            setTimeToRequestNewCode(60);
        }
    }

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await auth.changePasswordWithToken({ password });

            setMessage("Senha alterada com sucesso, vá para a tela de login.");
            setMessageType("success");
        } catch {
            setMessage("Erro ao alterar senha. Atualize a página e solicite um novo código de verificação.");
        } finally {
            clearEmail();
            clearSteps();
            clearTime();
        }

    }

    useEffect(() => {
        emailRef.current = email;
    }, [email]);

    useEffect(() => {
        const handleOtpCode = async () => {
            if (otpCode.length === 6) {
                setLoading(true);

                try {
                    await auth.verifyOtpCode({
                        email: emailRef.current,
                        otp: otpCode
                    });

                    updateStep("change-password");
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
    }, [otpCode, updateStep]);


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
    }, [timeToRequestNewCode, setTimeToRequestNewCode]);

    return (
        <>
            <SendEmailStep
                email={email}
                handleEmailSubmit={handleEmailSubmit}
                message={message}
                setEmail={setEmail}
                step={step}
                clearSteps={clearSteps}
                clearEmail={clearEmail}
                clearTime={clearTime}
            />

            <SendCodeStep
                email={email}
                message={message}
                step={step}
                loading={loading}
                otpCode={otpCode}
                requestNewCode={requestNewCode}
                setOtpCode={setOtpCode}
                timeToRequestNewCode={timeToRequestNewCode}
                clearSteps={clearSteps}
                clearEmail={clearEmail}
                clearTime={clearTime}
            />

            <ChangePasswordStep
                message={message}
                step={step}
                setPassword={setPassword}
                password={password}
                clearEmail={clearEmail}
                clearSteps={clearSteps}
                clearTime={clearTime}
                handlePasswordChange={handlePasswordChange}
                messageType={messageType}
            />

            {
                loading &&
                <span className="loader"></span>
            }
        </>
    );
}