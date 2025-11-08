import "../index.css";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AvocadoroContext } from "./store/AvocadoroContext";
import { ThreeDot } from "react-loading-indicators";

type SessionGroups = {
    id: string;
    name: string;
    focus_time: number;
    break_time: number;
};

export default function Dashboard() {
    const [loading, setLoading] = useState<boolean>(true);
    const [sessionGroups, setSessionGroups] = useState<SessionGroups[]>([]);

    const { session, supabase } = useContext(AvocadoroContext);
    const navigate = useNavigate();

    useEffect(() => {
        const loadGroups = async () => {
            if (!session || !session.user) return; // Wait until session is ready

            setLoading(true);

            const { data, error } = await supabase
                .from("session_groups")
                .select("*")
                .eq("user_id", session.user.id);

            if (error) {
                console.error("Error loading groups:", error);
            } else {
                setSessionGroups(data);
            }

            setTimeout(() => {
                setLoading(false);
            }, 500);
        };

        loadGroups();
    }, [session]); // 👈 This reruns whenever session changes

    async function signOut(): Promise<void> {
        const { error } = await supabase.auth.signOut();

        navigate("/");
    }

    if (loading) {
        return (
            <div className="test">
                <ThreeDot
                    color="#32cd32"
                    size="medium"
                    text=""
                    textColor=""
                />{" "}
            </div>
        );
    }

    return (
        <div className="vertical_test">
            <button onClick={signOut}>Log out</button>
            Dashboard
            <button
                onClick={() => {
                    navigate("/add_group");
                }}
            >
                Add new group
            </button>
            <div className="vertical_test">
                {sessionGroups.map((group: SessionGroups) => (
                    <div
                        key={group.id}
                        onClick={() =>
                            navigate(`/group/${group.id}`, { state: group })
                        }
                    >
                        {group.name}
                    </div>
                ))}
            </div>
        </div>
    );
}
