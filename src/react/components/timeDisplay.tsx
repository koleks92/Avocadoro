import { memo } from "react";

export default memo(function TimeDisplay({
    totalSeconds,
}: {
    totalSeconds: number;
}) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return (
        <span className="timer_time_span">
            {String(minutes).padStart(2, "0")[0]}
            {String(minutes).padStart(2, "0")[1]}:
            {String(seconds).padStart(2, "0")[0]}
            {String(seconds).padStart(2, "0")[1]}
        </span>
    );
});
