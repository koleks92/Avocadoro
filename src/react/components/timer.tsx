import "../../index.css";

import { useEffect, useRef, useState } from "react";
import Button from "./button";

import { IoIosPause } from "react-icons/io";
import { IoIosPlay } from "react-icons/io";
import { IoIosRefresh } from "react-icons/io";

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

    useEffect(() => {});

    useEffect(() => {
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
                setMessage("Focus Time");
                setMinutes(focusTimer);
                setTimerMode("focus");
            } else {
                // Pass the complete session
                onComplete(focusTimer);
                // Set break mode
                setMessage("Break Time");
                setMinutes(breakTimer);
                setTimerMode("break");
            }
        }
    }, [seconds, minutes]);

    const start = (): void => {
        setMessage("");
        if (timerRef.current !== null) return; // prevent multiple intervals
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
        setMessage("");
        if (timerRef.current !== null) {
            clearInterval(timerRef.current);
        }
        timerRef.current = null;
        setMinutes(focusTimer);
        setSeconds(0);
    };
    return (
        <div className="timer_root">
            <span className="timer_title_span">
                {timerMode === "break" ? "Break" : "Focus"}
            </span>
            <span className="timer_time_span">
                {minutes}:{seconds}
            </span>
            <div className="timer_button_div">
                <Button
                    type="button"
                    style="custom_button timer_button_main"
                    label={<IoIosPlay />}
                    onClick={() => start()}
                />
                <Button
                    type="button"
                    label={<IoIosPause />}
                    style="custom_button timer_button_main"
                    onClick={() => stop()}
                />
            </div>
            <Button
                type="button"
                style="custom_button timer_button_restart"
                label={<IoIosRefresh />}
                onClick={() => {
                    setMessage("Double click for reset");
                }}
                onDoubleClick={() => reset()}
            />
            <span>{message}</span>
        </div>
    );
}

export default Timer;
