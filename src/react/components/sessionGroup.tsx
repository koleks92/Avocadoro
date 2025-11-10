import "../../index.css";

type SessionGroupProps = {
    name: string;
    focusTimer: number;
    breakTimer: number;
};

function SessionGroup({ name, focusTimer, breakTimer }: SessionGroupProps) {
    return (
        <div className="session_group_root">
            <div className="session_group_title">{name}</div>
            <div>Total time: TODO</div>
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
