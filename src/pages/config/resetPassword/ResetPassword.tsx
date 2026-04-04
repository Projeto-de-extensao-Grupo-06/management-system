import { useState, useEffect } from "react";
import PageLayout from "../../../components/layout/PageLayout";
import { ChangePasswordStep } from "../../../components/recoveryPasswordSteps/RecoveryPasswordSteps";
import authService from "../../../services/AuthService";
import styles from "./ResetPassword.module.css";

const auth = new authService();

export default function ResetPassword() {
    useEffect(() => {
        document.title = "Redefinir Senha | SolarWay";
    }, []);

    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"error" | "success" | "warning" | undefined>(undefined);

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await auth.changePasswordAuthenticated({ password });
            setMessage("Senha redefinida com sucesso!");
            setMessageType("success");
            setPassword("");
        } catch {
            setMessage("Erro ao redefinir a senha. Tente novamente.");
            setMessageType("error");
        }
    };

    return (
        <PageLayout title="Redefinir Senha" backButton>
            <div className={styles.container}>
                <div className={styles.card}>
                    <ChangePasswordStep
                        step="change-password"
                        message={message}
                        messageType={messageType}
                        password={password}
                        setPassword={setPassword}
                        handlePasswordChange={handlePasswordChange}
                        hideLoginLink={true}
                    />
                </div>
            </div>
        </PageLayout>
    );
}
