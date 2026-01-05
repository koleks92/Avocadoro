import "../index.css";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AvocadoroContext } from "./store/AvocadoroContext";
import Loading from "./components/loading";
import Button from "./components/button";
import { MdLogout, MdAdd, MdOutlineSettings } from "react-icons/md";
import SessionGroup from "./components/sessionGroup";
import MotionDiv from "./components/motionDiv";

type SessionGroups = {
    id: string;
    name: string;
    focus_timer: number;
    break_timer: number;
    total_minutes: number;
};

export default function Dashboard() {
    const [sessionGroups, setSessionGroups] = useState<SessionGroups[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const { session, supabase } = useContext(AvocadoroContext);
    const navigate = useNavigate();

    useEffect(() => {
        window.electronAPI.setTimer("");
    }, []);

    useEffect(() => {
        const loadGroups = async () => {
            // Wait until session is ready
            if (!session || !session.user) return;

            const { data, error } = await supabase
                .from("session_groups")
                .select(
                    `
                    id,
                    name,
                    focus_timer,
                    break_timer,
                    sessions ( duration_minutes )
                    `
                )
                .eq("user_id", session.user.id);

            if (error) {
                console.error("Error loading groups:", error);
            } else {
                const groupsWithTotals = data.map((group) => ({
                    ...group,
                    total_minutes: group.sessions.reduce(
                        (sum, s) => sum + s.duration_minutes,
                        0
                    ),
                }));
                setSessionGroups(groupsWithTotals);
            }
            setLoading(false);
        };

        loadGroups();
    }, [session]);

    async function signOut(): Promise<void> {
        const { error } = await supabase.auth.signOut();

        navigate("/");
    }

    if (!loading) {
        return (
            <MotionDiv>
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
                        <span className="dashboard_title_span">
                            My session groups
                        </span>
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
                                    navigate(`/group/${group.id}`, {
                                        state: group,
                                    })
                                }
                            >
                                <SessionGroup
                                    name={group.name}
                                    focusTimer={group.focus_timer}
                                    breakTimer={group.break_timer}
                                    totalMinutes={group.total_minutes}
                                />
                            </div>
                        ))}
                        <div onClick={() => navigate("/add_group")}>
                            <SessionGroup name="Add new" addNew={true} />
                        </div>
                    </div>
                    <div className="dashboard_bottom_div">
                        <Button
                            onClick={() => navigate("/settings")}
                            type="button"
                            style="custom_button button_logo_dashboard"
                            label={<MdOutlineSettings />}
                        />
                    </div>
                </div>
            </MotionDiv>
        );
    }
}
