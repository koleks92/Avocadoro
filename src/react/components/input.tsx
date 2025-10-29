import { useState, ChangeEvent } from "react";

type Props = {
  type: string;
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

function Input({ type, placeholder, value, onChange}: Props) {

    return (
        <div>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    );
}

export default Input;
