import { useState } from "react";
import type { Steps } from "../interfaces/types/ForgetPasswordSteps";

export default function usePasswordRecoverySteps() {
    const getStep = (): Steps => {
        const step: Steps = sessionStorage.getItem("recovery-step") as Steps;

        if(!step) {
            sessionStorage.setItem("recovery-step", "send-email")
            return "send-email";
        }
        
        return step;
    }

    const [step, setStep] = useState<Steps>(() => getStep());

    const updateStep = (step: Steps) => {
        setStep(step);
        sessionStorage.setItem("recovery-step", step);
    }

    const clearSteps = () => {
        sessionStorage.removeItem("recovery-step");
    }

    return {
        step,
        updateStep,
        clearSteps
    }
}