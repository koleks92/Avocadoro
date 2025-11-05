import { useState, ChangeEvent } from "react";

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
            />
        </div>
    );
}

export default Input;
