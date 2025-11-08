import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { AvocadoroContext } from "./store/AvocadoroContext";
import Input from "./components/input";
import Button from "./components/button";

export default function AddGroup() {
    const { id } = useParams<{ id: string }>();
    const { state } = useLocation();
    const navigate = useNavigate();

    const [name, setName] = useState<string>("");
    const [focusTimer, setFocusTimer] = useState<number>(25);
    const [breakTimer, setBreakTimer] = useState<number>(5);
    const [message, setMessage] = useState<string>("");

    const { session, supabase } = useContext(AvocadoroContext);

    useEffect(() => {
        if (id && state && state.edit) {
            setName(state.name);
            setFocusTimer(state.focus_timer);
            setBreakTimer(state.break_timer);
        }
    }, [id]);

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

    return (
        <div className="vertical_test">
            <Button
                label="Go Back"
                type="button"
                onClick={() => {
                    navigate("/dashboard");
                }}
            />
            {state?.edit ? (
                <span>Edit avocadoro group</span>
            ) : (
                <span>Add new avocadoro group</span>
            )}
            <form onSubmit={addNewGroupHandler}>
                <label>Enter new avocadoro focus name</label>
                <Input
                    type="text"
                    placeholder="Avocadoro name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <label>Enter focus time in minutes</label>
                <Input
                    type="number"
                    min={1}
                    max={60}
                    placeholder="Focus time"
                    value={focusTimer}
                    onChange={(e) => setFocusTimer(Number(e.target.value))}
                />
                <label>Enter break time in minutes</label>
                <Input
                    type="number"
                    min={1}
                    max={60}
                    placeholder="Break time"
                    value={breakTimer}
                    onChange={(e) => setBreakTimer(Number(e.target.value))}
                />
                <Button label={state?.edit ? "Update" : "Add"} type="submit" />
            </form>
            <span>{message}</span>
        </div>
    );
}
