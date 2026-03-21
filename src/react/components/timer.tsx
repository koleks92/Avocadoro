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

type timerModeType = "focus" | "break";

type TimerProps = {
    onComplete?: (minutes: number, finishTime: number) => void;
    focusTimer?: number;
    breakTimer?: number;
    timerOnSupabase?: boolean;
    finishTimeSupabase?: string;
    sessionGroupId?: string;
};

function Timer({
    onComplete,
    focusTimer,
    breakTimer,
    timerOnSupabase,
    finishTimeSupabase,
    sessionGroupId,
}: TimerProps) {
    const [timerMode, setTimerMode] = useState<timerModeType>("focus");
    const [totalSeconds, setTotalSeconds] = useState<number>(focusTimer * 60);

    const timerRef = useRef<number | null>(null);
    const endTimeRef = useRef<number | null>(null);

    const { timerOn, setTimerOn, supabase, message, setMessage } =
        useContext(AvocadoroContext);

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // Block mouse buttons function
    const blockMouseBackForward = (e: MouseEvent) => {
        if (e.button === 3 || e.button === 4) {
            e.preventDefault();
        }
    };

    // Update database with timer_on = True and finish_date
    const setTimerAndFinishTime = async (reset: boolean): Promise<void> => {
        let newFinishTime: string;

        if (reset) {
            // Reset the total seconds
            newFinishTime = new Date(
                Date.now() + focusTimer * 60 * 1000,
            ).toISOString();
        } else {
            // Kepp the total seconds
            newFinishTime = new Date(
                Date.now() + totalSeconds * 1000,
            ).toISOString();
        }

        const { data, error } = await supabase
            .from("session_groups")
            .update({
                timer_on: true,
                finish_time: newFinishTime,
            })
            .eq("id", sessionGroupId);
    };

    // Update database with timer_on = False and finish_date = null
    const unsetTimerAndFinishDate = async (): Promise<void> => {
        const { data, error } = await supabase
            .from("session_groups")
            .update({
                timer_on: false,
                finish_time: null,
            })
            .eq("id", sessionGroupId);
    };

    useEffect(() => {
        // Check if timer is running on another device and start the timer
        if (timerOnSupabase && finishTimeSupabase) {
            const finishTime = new Date(finishTimeSupabase + "Z").getTime();
            const remaining = Math.ceil((finishTime - Date.now()) / 1000);

            if (remaining > 0) {
                setTotalSeconds(remaining);
                setTimerOn(true);
                endTimeRef.current = finishTime;
                timerRef.current = window.setInterval(() => {
                    setTotalSeconds((prev) => prev - 1);
                }, 1000);
            }

            setMessage("Remeber to reset timer on another device!");
            setTimeout(() => {
                setMessage("");
            }, 15000);
        }

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
        window.electronAPI.setTimerOn(timerOn);

        if (timerOn) {
            window.addEventListener("mouseup", blockMouseBackForward);
        }

        return () => {
            window.removeEventListener("mouseup", blockMouseBackForward);
        };
    }, [timerOn]);

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
            if (timerMode === "break") {
                // Set focus mode, reset the timer and play the sounds/vibrations
                setTimerMode("focus");
                setTotalSeconds(focusTimer * 60);
                endTimeRef.current = Date.now() + focusTimer * 60 * 1000;
                const audio = new Audio(focusTimeSound);
                audio.play().catch((e) => console.log("Playback failed:", e));
                setTimerAndFinishTime(true);
            } else {
                // Set break mode, reset the timer and play the sounds/vibrations
                onComplete(focusTimer, endTimeRef.current);
                setTimerMode("break");
                setTotalSeconds(breakTimer * 60);
                endTimeRef.current = Date.now() + breakTimer * 60 * 1000;
                const audio = new Audio(breakTimeSound);
                audio.play().catch((e) => console.log("Playback failed:", e));
                unsetTimerAndFinishDate();
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
        timerRef.current = window.setInterval(() => {
            setTotalSeconds((prev) => prev - 1);
        }, 1000);

        // Update database with timer_on = True and finish_date
        setTimerAndFinishTime(false);
    };

    // Stop/Pause timer
    const stop = (): void => {
        setMessage("");
        if (timerRef.current !== null) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        // Update database with timer_on = False and finish_date = null
        unsetTimerAndFinishDate();
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

        // Update database with timer_on = False and finish_date = null
        unsetTimerAndFinishDate();
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

            // Update database with timer_on = True and finish_date
            setTimerAndFinishTime(true);
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
