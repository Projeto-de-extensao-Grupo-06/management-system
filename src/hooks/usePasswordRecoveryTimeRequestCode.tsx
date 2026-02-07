import { useState } from "react";

export default function usePasswordRecoveryTimeRequestCode() {
    const getTime = () => Number(sessionStorage.getItem("time-request-code") ?? 0);

    const [timeToRequestNewCode, setTimeToRequestNewCode] = useState<number>(() => getTime());

    const updateTime = (time: number) => {
        setTimeToRequestNewCode(time);
        sessionStorage.setItem("time-request-code", time.toString());
    }

    const clearTime = () => {
        sessionStorage.removeItem("time-request-code");
    }

    return {
        timeToRequestNewCode,
        setTimeToRequestNewCode: updateTime,
        clearTime
    }
}