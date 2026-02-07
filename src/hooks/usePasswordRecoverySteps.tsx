import { useCallback, useState } from "react";
import type { Steps } from "../interfaces/types/ForgetPasswordSteps";

export default function usePasswordRecoverySteps() {
    const getStep = (): Steps => {
        const step = sessionStorage.getItem("recovery-step") as Steps;

        if (!step) {
            sessionStorage.setItem("recovery-step", "send-email");
            return "send-email";
        }

        return step;
    };

    const [step, setStep] = useState<Steps>(getStep);

    const updateStep = useCallback((nextStep: Steps) => {
        setStep(nextStep);
        sessionStorage.setItem("recovery-step", nextStep);
    }, []);

    const clearSteps = useCallback(() => {
        sessionStorage.removeItem("recovery-step");
    }, []);

    return {
        step,
        updateStep,
        clearSteps
    };
}
