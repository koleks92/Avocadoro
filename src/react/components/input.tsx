import { useState, ChangeEvent } from "react";
import "../../index.css"


type Props = {
    type: string;
    placeholder?: string;
    value: string | number;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    min?: number; // ✅ optional
    max?: number; // ✅ optional
};

function Input({ type, placeholder, value, onChange, min, max }: Props) {
    return (
        <div>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                min={min}
                max={max}
                className="custom_input"
            />
        </div>
    );
}

export default Input;
