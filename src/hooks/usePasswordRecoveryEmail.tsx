import { useState } from "react";

export default function usePasswordRecoveryEmail() {
    const getEmail = () => sessionStorage.getItem("recovery-email") ?? "";

    const [email, setEmail] = useState<string>(() => getEmail());

    const updateEmail = (email: string) => {
        setEmail(email);
        sessionStorage.setItem("recovery-email", email);
    }

    const clearEmail = () => {
        sessionStorage.removeItem("recovery-email");
    }

    return {
        email,
        setEmail: updateEmail,
        clearEmail
    }
}