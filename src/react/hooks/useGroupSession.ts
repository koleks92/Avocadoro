import { useState, useEffect } from "react";
import { SupabaseClient } from "@supabase/supabase-js";
import { convertTime } from "../util/extra";

export function useGroupSession(
    supabase: SupabaseClient,
    id: string,
    state: any,
    setMessage: (msg: string) => void,
) {
    const [totalSeconds, setTotalSeconds] = useState(0);
    const [timerView, setTimerView] = useState(true);
    const [totalMinutes, setTotalMinutes] = useState(state.total_minutes);
    const [avocadoroAmount, setAvocadoroAmount] = useState(0);
    const [totalTime, setTotalTime] = useState("");

    useEffect(() => {
        setAvocadoroAmount(Math.floor(totalMinutes / state.focus_timer));
        setTotalTime(convertTime(totalMinutes));
    }, [totalMinutes]);

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;
        const el = document.querySelector(".group_second_div") as HTMLElement | null;

        if (!timerView && el) {
            timeout = setTimeout(() => el.classList.add("delay-scroll"), 500);
        } else {
            el?.classList.remove("delay-scroll");
        }

        return () => clearTimeout(timeout);
    }, [timerView]);

    const onCompleteHandler = async (minutes: number, finishTime: number) => {
        setMessage("");

        const { error } = await supabase
            .from("sessions")
            .insert({
                session_group_id: id,
                duration_minutes: minutes,
                finish_time: new Date(finishTime).toISOString(),
            })
            .select();

        setAvocadoroAmount((prev: number) => prev + 1);
        setTotalMinutes((prev: number) => prev + state.focus_timer);

        if (error) {
            setMessage("Cannot save data.\nAre you running a timer on another device?");
            setTimeout(() => setMessage(""), 15000);
        }
    };

    return {
        totalSeconds, setTotalSeconds,
        timerView, setTimerView,
        totalMinutes, avocadoroAmount, totalTime,
        onCompleteHandler,
    };
}