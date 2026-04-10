import { useEffect, useRef, useState } from "react";

import breakTimeSound from "./../sounds/breakTime.mp3";
import focusTimeSound from "./../sounds/focusTime.mp3";

type TimerModeType = "focus" | "break";

export function useTimer(
    setMessage: (msg: string) => void,
    timerMode: TimerModeType,
    setTimerMode: (type: TimerModeType) => void,
    timerOn: boolean,
    setTimerOn: (val: boolean) => void,
    focusTimer: number,
    breakTimer: number,
    onComplete?: (minutes: number, finishTime: number) => void,
    onTotalSecondsChange?: (seconds: number) => void,
) {
    const [totalSeconds, setTotalSeconds] = useState<number>(focusTimer * 60);

    const timerRef = useRef<number | null>(null);
    const endTimeRef = useRef<number | null>(null);

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    useEffect(() => {
        // If timer is off
        if (timerRef.current === null) return;

        // Electron context sharing
        const timerString = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
        if (timerMode === "focus") {
            window.electronAPI.setTimer("F " + timerString);
        } else {
            window.electronAPI.setTimer("B " + timerString);
        }

        // Timer functions
        if (totalSeconds === 0) {
            if (timerRef.current !== null) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }

            if (timerMode === "break") {
                // Set focus mode, reset the timer and play the sounds/vibrations
                setTimerMode("focus");
                setTotalSeconds(focusTimer * 60);
                endTimeRef.current = Date.now() + focusTimer * 60 * 1000;
                const audio = new Audio(focusTimeSound);
                audio.play().catch((e) => console.log("Playback failed:", e));
            } else {
                // Set break mode, reset the timer and play the sounds/vibrations
                onComplete(focusTimer, endTimeRef.current);
                setTimerMode("break");
                setTotalSeconds(breakTimer * 60);
                endTimeRef.current = Date.now() + breakTimer * 60 * 1000;
                const audio = new Audio(breakTimeSound);
                audio.play().catch((e) => console.log("Playback failed:", e));
            }

            // Start the timer
            timerRef.current = window.setInterval(() => {
                if (endTimeRef.current === null) return;
                const remaining = Math.ceil(
                    (endTimeRef.current - Date.now()) / 1000,
                );
                setTotalSeconds(Math.max(0, remaining));
            }, 1000);
        }
    }, [totalSeconds]);

    // Start timer function
    const start = (): void => {
        setMessage("");
        if (timerRef.current !== null) return; // prevent multiple intervals
        setTimerOn(true);
        endTimeRef.current = Date.now() + totalSeconds * 1000;
        timerRef.current = window.setInterval(() => {
            if (endTimeRef.current === null) return;
            const remaining = Math.ceil(
                (endTimeRef.current - Date.now()) / 1000,
            );
            setTotalSeconds(Math.max(0, remaining));
        }, 1000);
    };


    // Stop/Pause timer
    const stop = (): void => {
        setMessage("");
        if (timerRef.current !== null) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    const reset = (): void => {
        if (timerRef.current !== null) {
            clearInterval(timerRef.current);
        }
        timerRef.current = null;
        setTotalSeconds(focusTimer * 60);
        setTimerOn(false);
        setTimerMode("focus");
        setMessage("");
    };

    // Reset the timer
    const skip = async (): Promise<void> => {
        // Clear existing interval if running
        if (timerRef.current !== null) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        // Reset to focus mode
        setTimerMode("focus");
        setTotalSeconds(focusTimer * 60);
        setMessage("");

        // Restart timer if it was running
        if (timerOn) {
            endTimeRef.current = Date.now() + focusTimer * 60 * 1000;

            timerRef.current = window.setInterval(() => {
                if (endTimeRef.current === null) return;
                const remaining = Math.ceil(
                    (endTimeRef.current - Date.now()) / 1000,
                );
                setTotalSeconds(Math.max(0, remaining));
            }, 1000);
        }
    };

    return {
        start,
        stop,
        reset,
        skip,
        totalSeconds,
        setTotalSeconds,
        endTimeRef,
        timerRef
    };
}
