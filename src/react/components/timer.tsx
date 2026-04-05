import "../../index.css";

import { useEffect, useRef, useState, useContext } from "react";
import Button from "./button";

import { IoIosPause } from "react-icons/io";
import { IoIosPlay } from "react-icons/io";
import { IoIosRefresh } from "react-icons/io";

import breakTimeSound from "./../sounds/breakTime.mp3";
import focusTimeSound from "./../sounds/focusTime.mp3";

import { AvocadoroContext } from "../store/AvocadoroContext";
import QuotePrinter from "./quotePrinter";
import TimeDisplay from "./timeDisplay";
import { useBlockMouse } from "../hooks/useTimer";

type TimerProps = {
    onComplete?: (minutes: number, finishTime: number) => void;
    focusTimer: number;
    breakTimer: number;
    supabaseId?: string;
    supabaseFinishTime?: string;
    onTotalSecondsChange?: (seconds: number) => void;
    transferRecived?: boolean;
};

function Timer({
    onComplete,
    focusTimer,
    breakTimer,
    supabaseId,
    supabaseFinishTime,
    onTotalSecondsChange,
    transferRecived,
}: TimerProps) {
    const [totalSeconds, setTotalSeconds] = useState<number>(focusTimer * 60);

    const timerRef = useRef<number | null>(null);
    const endTimeRef = useRef<number | null>(null);

    const { timerOn, setTimerOn, supabase, message, setMessage, timerMode, setTimerMode } =
        useContext(AvocadoroContext);

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // Block mouse back button when timer is on
    useBlockMouse(timerOn);

    useEffect(() => {
        if (transferRecived) reset();
    }, [transferRecived]);

    useEffect(() => {
        // Check if timer is running on another device and start the timer
        if (supabaseFinishTime && supabaseId) {
            const finishTime = new Date(supabaseFinishTime + "Z").getTime();
            const remaining = Math.ceil((finishTime - Date.now()) / 1000);

            if (remaining > 0) {
                setTotalSeconds(remaining);
                setTimerOn(true);
                endTimeRef.current = finishTime; // set AFTER start so it doesn't get overwritten
                timerRef.current = window.setInterval(() => {
                    if (endTimeRef.current === null) return;
                    const remaining = Math.ceil(
                        (endTimeRef.current - Date.now()) / 1000,
                    );
                    setTotalSeconds(Math.max(0, remaining));
                }, 1000);
            }
        }
    }, [supabaseFinishTime]);

    useEffect(() => {
        // !!! Testing only, allows to change the timer !!!
        (window as any).skipForward = (secs: number) => {
            setTotalSeconds(secs);
        };

        // Cleanup when component unmounts
        return () => {
            delete (window as any).skipForward;
        };
    }, []);

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

        // Pass to parent component
        onTotalSecondsChange?.(totalSeconds);

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

    return (
        <div className="timer_root">
            <span className="timer_title_span">
                {timerMode === "break" ? "Break" : "Focus"}
            </span>
            {timerMode === "break" ? (
                <div>
                    <Button
                        type="button"
                        style="custom_button custom_button_nobg button_skip"
                        label="Skip"
                        onClick={() => skip()}
                    />
                </div>
            ) : (
                <div style={{ visibility: "hidden" }}>
                    <Button
                        type="button"
                        style="custom_button custom_button_nobg button_skip"
                        label="Skip"
                        onClick={() => skip()}
                    />
                </div>
            )}
            <TimeDisplay totalSeconds={totalSeconds} />
            <QuotePrinter />
            <div className="timer_button_div">
                <Button
                    type="button"
                    style="custom_button timer_button_main button_start"
                    label={<IoIosPlay />}
                    onClick={() => start()}
                />
                <Button
                    type="button"
                    label={<IoIosPause />}
                    style="custom_button timer_button_main button_stop"
                    onClick={() => stop()}
                />
            </div>
            <Button
                type="button"
                style="custom_button timer_button_restart"
                label={<IoIosRefresh />}
                onClick={() => {
                    setMessage("Double click for reset");
                    setTimeout(() => {
                        setMessage("");
                    }, 5000);
                }}
                onDoubleClick={() => reset()}
            />
            <span className="message_span">{message}</span>
        </div>
    );
}

export default Timer;
