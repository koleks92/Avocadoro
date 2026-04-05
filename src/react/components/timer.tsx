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
import { useBlockMouse } from "../hooks/useBlockMouse";
import { useTimer } from "../hooks/useTimer";

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
    const timerRef = useRef<number | null>(null);
    const endTimeRef = useRef<number | null>(null);

    // Avocadoro Context
    const {
        timerOn,
        setTimerOn,
        supabase,
        message,
        setMessage,
        timerMode,
        setTimerMode,
    } = useContext(AvocadoroContext);

    // Block mouse back button when timer is on
    useBlockMouse(timerOn);

    // Timer hooks
    const { start, stop, reset, skip, totalSeconds, setTotalSeconds } = useTimer(
        setMessage,
        timerMode,
        setTimerMode,
        timerOn,
        setTimerOn,
        focusTimer,
        breakTimer,
        onComplete,
        onTotalSecondsChange,
    );

    // Pass to parent component
    onTotalSecondsChange?.(totalSeconds);

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
