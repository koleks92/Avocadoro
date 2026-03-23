import { SupabaseClient } from "@supabase/supabase-js";

// Update database with timer_on = True and finish_date
export const setTimerAndFinishTime = async (
    supabase: SupabaseClient,
    reset: boolean,
    focusTimer: number,
    totalSeconds: number,
    sessionGroupId: string,
): Promise<void> => {
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
export const unsetTimerAndFinishDate = async (
    supabase: SupabaseClient,
    sessionGroupId: string,
): Promise<void> => {
    const { data, error } = await supabase
        .from("session_groups")
        .update({
            timer_on: false,
            finish_time: null,
        })
        .eq("id", sessionGroupId);
};
