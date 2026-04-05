import { NavigateFunction } from "react-router-dom";
import { createClient, SupabaseClient, Session } from "@supabase/supabase-js";

export function useGroup(
    supabase: SupabaseClient,
    navigate: NavigateFunction,
    setMessage: (msg: string) => void,
    name: string,
    session: Session,
    state: any,
    focusTimer: number,
    breakTimer: number,
) {
    async function addNewGroupHandler(e: React.FormEvent): Promise<void> {
        e.preventDefault();

        setMessage("");

        // Check if name provided
        if (!name || name === "") {
            setMessage("Missing avocadoro name");
            return;
        }

        // Double check if logged in correctly
        if (!session.user.id) {
            setMessage("Something went wrong, please try again!");
            return;
        }

        // Check if already in database
        const { data: existingGroup, error: fetchError } = await supabase
            .from("session_groups")
            .select("*")
            .eq("user_id", session.user.id)
            .eq("name", name.trim())
            .maybeSingle();

        if (fetchError) {
            console.error("Error checking for existing group:", fetchError);
            return;
        }

        if (existingGroup && existingGroup.id != state?.id) {
            setMessage("You already have a group with that name.");
            return;
        }

        if (state?.edit) {
            // Edit data
            const { data, error } = await supabase
                .from("session_groups")
                .update({
                    name: name.trim(),
                    focus_timer: focusTimer,
                    break_timer: breakTimer,
                })
                .eq("id", state.id)
                .select();

            if (data) {
                navigate("/dashboard");
            }

            if (error) {
                setMessage(error.message);
            }
        } else {
            // Insert new data
            const { data, error } = await supabase
                .from("session_groups")
                .insert({
                    user_id: session.user.id,
                    name: name.trim(),
                    focus_timer: focusTimer,
                    break_timer: breakTimer,
                })
                .select();

            if (data) {
                navigate("/dashboard");
            }

            if (error) {
                setMessage(error.message);
            }
        }
    }

    async function deleteGroup(): Promise<void> {
        const { data, error } = await supabase
            .from("session_groups")
            .delete()
            .eq("id", state.id)
            .select();

        if (error) {
            setMessage(error.message);
        }

        if (data) {
            navigate("/dashboard");
        }
    }

    return { addNewGroupHandler, deleteGroup}
}
