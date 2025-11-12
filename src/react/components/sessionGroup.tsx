import { useEffect, useState } from "react";
import "../../index.css";

type SessionGroupProps = {
    name: string;
    focusTimer: number;
    breakTimer: number;
    totalMinutes: number;
};

function SessionGroup({
    name,
    focusTimer,
    breakTimer,
    totalMinutes,
}: SessionGroupProps) {
    const [time, setTime] = useState<string>("0:00h");

    useEffect(() => {
        function convertTime(): void {
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;

            // Pad with leading zeros if needed
            const paddedHours = String(hours).padStart(2, "0");
            const paddedMinutes = String(minutes).padStart(2, "0");

            setTime(`${paddedHours}:${paddedMinutes}h`);
        }

        convertTime();
    }, []);

    return (
        <div className="session_group_root">
            <div className="session_group_title">{name}</div>
            <div className="center_column_div">
                Total time
                <div>{time}</div>
            </div>
            <div className="session_group_times">
                <div>
                    <div>Focus </div>
                    <div>{focusTimer}min</div>
                </div>
                <div>
                    <div>Break</div>
                    <div>{breakTimer}min</div>
                </div>
            </div>
        </div>
    );
}

export default SessionGroup;
