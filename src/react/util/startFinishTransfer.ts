import { SupabaseClient } from "@supabase/supabase-js";

// Update database with timer_on = True and finish_date
export const startTransfer = async (
    supabase: SupabaseClient,
    totalSeconds: number,
    sessionGroupId: string,
): Promise<void> => {
    let newFinishTime: string = new Date(
        Date.now() + totalSeconds * 1000,
    ).toISOString();

    const { data, error } = await supabase
        .from("session_groups")
        .update({
            timer_on: true,
            finish_time: newFinishTime,
            transfer_status: "send"
        })
        .eq("id", sessionGroupId);
};

// Cancel transfer
export const cancelTransfer = async (
    supabase: SupabaseClient,
    sessionGroupId: string,
): Promise<void> => {
    const { data, error } = await supabase
        .from("session_groups")
        .update({
            timer_on: false,
            finish_time: null,
            transfer_status: null
        })
        .eq("id", sessionGroupId);
};

// Update database with timer_on = False and finish_date = null
export const finishTransfer = async (
    supabase: SupabaseClient,
    sessionGroupId: string,
): Promise<void> => {
    const { data, error } = await supabase
        .from("session_groups")
        .update({
            timer_on: false,
            finish_time: null,
            transfer_status: "recived"
        })
        .eq("id", sessionGroupId);
};
