import { useEffect, useState } from "react";
import "../../index.css";
import { MdAdd } from "react-icons/md";
import { convertTime } from "../util/extra";

type SessionGroupProps = {
    name: string;
    focusTimer?: number;
    breakTimer?: number;
    totalMinutes?: number;
    addNew?: boolean;
};

function SessionGroup({
    name,
    focusTimer,
    breakTimer,
    totalMinutes,
    addNew,
}: SessionGroupProps) {
    const [time, setTime] = useState<string>("0:00h");

    useEffect(() => {
        setTime(convertTime(totalMinutes));
    }, []);

    if (addNew) {
        return (
            <div className="session_group_root">
                <div className="session_group_title">{name}</div>
                <div className="session_group_add">
                    <MdAdd />
                </div>
            </div>
        );
    } else {
        return (
            <div className="session_group_root">
                <div className="session_group_title">{name}</div>
                <div className="center_column_div">
                    Total time
                    <div>{time}</div>
                </div>
                <div className="session_group_times">
                    <div className="center_column_div">
                        <div className="center_column_div">Focus</div>
                        <div className="center_column_div">{focusTimer}min</div>
                    </div>
                    <div>
                        <div className="center_column_div">Break</div>
                        <div className="center_column_div">{breakTimer}min</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SessionGroup;
