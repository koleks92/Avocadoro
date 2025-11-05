import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AvocadoroContext } from "./store/AvocadoroContext";
import Input from "./components/input";
import Button from "./components/button";

export default function AddGroup() {
    const [name, setName] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    const { session, supabase } = useContext(AvocadoroContext);

    const navigate = useNavigate();

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

        if (existingGroup) {
            setMessage("You already have a group with that name.");
            return;
        }

        // Insert data
        const { data, error } = await supabase
            .from("session_groups")
            .insert({
                user_id: session.user.id,
                name: name.trim(),
            })
            .select();

        if (data) {
            navigate("/dashboard")
        }

        if (error) {
            setMessage(error.message);
        }
    }

    return (
        <div className="vertical_test">
            <button
                onClick={() => {
                    navigate("/dashboard");
                }}
            >
                Go Back
            </button>
            Add new avocadoro group
            <form onSubmit={addNewGroupHandler}>
                <label>Enter new avocadoro focus name</label>
                <Input
                    type="text"
                    placeholder="Avocadoro name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Button label="Add" type="submit" />
            </form>
            <span>{message}</span>
        </div>
    );
}
