import { useEffect } from "react";

export function useBlockMouse(timerOn: boolean) {
    // Block mouse buttons function
    const blockMouseBackForward = (e: MouseEvent) => {
        if (e.button === 3 || e.button === 4) {
            e.preventDefault();
        }
    };
    // Block mouse back button
    useEffect(() => {
        window.electronAPI.setTimerOn(timerOn);

        if (timerOn) {
            window.addEventListener("mouseup", blockMouseBackForward);
        }

        return () => {
            window.removeEventListener("mouseup", blockMouseBackForward);
        };
    }, [timerOn]);
}
