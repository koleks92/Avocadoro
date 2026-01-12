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

type timerModeType = "focus" | "break";

type TimerProps = {
    onComplete?: (minutes: number) => void;
    focus_timer?: number;
    break_timer?: number;
};

function Timer({ onComplete, focus_timer, break_timer }: TimerProps) {
    const [focusTimer, setFocusTimer] = useState<number>(focus_timer);
    const [breakTimer, setBreakTimer] = useState<number>(break_timer);

    const [timerMode, setTimerMode] = useState<timerModeType>("focus");

    const [minutes, setMinutes] = useState<number>(focusTimer);
    const [seconds, setSeconds] = useState<number>(0);

    const [message, setMessage] = useState<string>("");

    const timerRef = useRef<number | null>(null);

    const { timerOn, setTimerOn } = useContext(AvocadoroContext);

    const blockMouseBackForward = (e: MouseEvent) => {
        if (e.button === 3 || e.button === 4) {
            e.preventDefault();
        }
    };

    // !!! Testing only, allows to change the timer !!!
    useEffect(() => {
        (window as any).skipForward = (mins: number, secs: number) => {
            setMinutes(mins);
            setSeconds(secs);
        };

        // Cleanup when component unmounts
        return () => {
            delete (window as any).skipForward;
        };
    }, []);

    useEffect(() => {
        window.electronAPI.setTimerOn(timerOn);

        if (timerOn) {
            window.addEventListener("mouseup", blockMouseBackForward);
        }

        return () => {
            window.removeEventListener("mouseup", blockMouseBackForward);
        };
    }, [timerOn]);

    useEffect(() => {
        // Electron context sharing
        const timerString = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
        if (timerMode === "focus") {
            window.electronAPI.setTimer("F " + timerString);
        } else {
            window.electronAPI.setTimer("B " + timerString);
        }

        // Timer
        if (timerRef.current === null) return;

        if (seconds <= 0) {
            setSeconds(59);
            setMinutes((prev) => prev - 1);
        }
    }, [seconds]);

    useEffect(() => {
        if (seconds === 0 && minutes === 0) {
            setSeconds(0);
            if (timerMode === "break") {
                // Set focus mode
                setMinutes(focusTimer);
                setTimerMode("focus");
                // Play the sound
                const audio = new Audio(focusTimeSound);
                audio.play().catch((e) => {
                    console.log("Playback failed:", e);
                });
            } else {
                // Pass the complete session
                onComplete(focusTimer);
                // Set break mode
                setMinutes(breakTimer);
                setTimerMode("break");
                // Play the sound
                const audio = new Audio(breakTimeSound);
                audio.play().catch((e) => {
                    console.log("Playback failed:", e);
                });
            }
        }
    }, [seconds, minutes]);

    const start = (): void => {
        setMessage("");
        if (timerRef.current !== null) return; // prevent multiple intervals
        setTimerOn(true);
        timerRef.current = window.setInterval(() => {
            setSeconds((prev) => prev - 1);
        }, 1000);
    };

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
        setMinutes(focusTimer);
        setSeconds(0);
        setTimerOn(false);
        setTimerMode("focus");
        setMessage("");
    };

    return (
        <div className="timer_root">
            <span className="timer_title_span">
                {timerMode === "break" ? "Break" : "Focus"}
            </span>
            <span className="timer_time_span">
                {String(minutes).padStart(2, "0")[0]}
                {String(minutes).padStart(2, "0")[1]}:
                {String(seconds).padStart(2, "0")[0]}
                {String(seconds).padStart(2, "0")[1]}
            </span>
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
