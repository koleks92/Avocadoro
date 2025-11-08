import { useParams, useLocation, useNavigate } from "react-router-dom";
import Timer from "./components/timer";
import { useContext, useState } from "react";
import { AvocadoroContext } from "./store/AvocadoroContext";
import Button from "./components/button";

export default function Group() {
    const { id } = useParams<{ id: string }>();
    const { state } = useLocation();
    const navigate = useNavigate();

    const [message, setMessage] = useState<string>("");

    const { session, supabase } = useContext(AvocadoroContext);

    async function onCompleteHandler(minutes: number): Promise<void> {
        setMessage("");

        // Insert data
        const { data, error } = await supabase
            .from("sessions")
            .insert({
                session_group_id: id,
                duration_minutes: minutes,
            })
            .select();

        if (error) {
            setMessage(error.message);
        }
    }

    return (
        <div>
            <span>Group {id}</span>
            <Button
                label="Go Back"
                type="button"
                onClick={() => {
                    navigate("/dashboard");
                }}
            />
            <Button label="Edit" type="button" onClick={() => {}} />
            <Timer
                onComplete={onCompleteHandler}
                focus_timer={state.focus_timer}
                break_timer={state.break_timer}
            />
            {message}
        </div>
    );
}
