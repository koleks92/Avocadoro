import "../index.css";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AvocadoroContext } from "./store/AvocadoroContext";
import Loading from "./components/loading";
import Button from "./components/button";
import { MdLogout, MdAdd } from "react-icons/md";
import SessionGroup from "./components/sessionGroup";

type SessionGroups = {
    id: string;
    name: string;
    focus_timer: number;
    break_timer: number;
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
        return <Loading />;
    }

    return (
        <div className="dashboard_root">
            <div className="dashboard_logo_div">
                <div>
                    <Button
                        onClick={signOut}
                        type="button"
                        style="custom_button button_logo_dashboard"
                        label={<MdLogout />}
                    />
                </div>
                <span className="dashboard_title_span">My session groups</span>
                <div>
                    <Button
                        onClick={() => navigate("/add_group")}
                        type="button"
                        style="custom_button button_logo_dashboard"
                        label={<MdAdd />}
                    />
                </div>
            </div>
            <div className="dashboard_session_group_div">
                {sessionGroups.map((group: SessionGroups) => (
                    <div
                        key={group.id}
                        onClick={() =>
                            navigate(`/group/${group.id}`, { state: group })
                        }
                    >
                        <SessionGroup
                            name={group.name}
                            focusTimer={group.focus_timer}
                            breakTimer={group.break_timer}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
