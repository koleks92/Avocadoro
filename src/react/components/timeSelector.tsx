import Button from "./button";
import "../../index.css";
import { useEffect, useState } from "react";

type TimeSelectorProps = {
    min: number;
    max: number;
    step: number;
    defaultValue: number;
    onClick: (number: number) => void;
};

function TimeSelector({ min, max, step, defaultValue, onClick }: TimeSelectorProps) {
    const [selected, setSelected] = useState<number>(defaultValue);

    useEffect(() => {
        onClick(selected);
    },[selected])

    const times: number[] = [];

    for (let i: number = min; i <= max; i += step) {
        times.push(i);
    }
    return (
        <div className="time_selector_div">
            {times.map((time) => {
                return (
                    <Button
                        type="button"
                        key={time}
                        label={time}
                        style={`custom_button time_selector_button ${selected === time ? "time_selector_selected" : ""}`}
                        onClick={() => setSelected(time)}
                    />
                );
            })}
        </div>
    );
}

export default TimeSelector;
