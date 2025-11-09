import "../../index.css";
import { ReactNode } from "react";

type Props = {
    label: ReactNode;
    onClick?: () => void;
    type: "button" | "submit" | "reset";
    style?: string;
    disabled?: boolean;
};

function Button({ label, onClick, type, style, disabled }: Props) {
    return (
        <div>
            <button
                onClick={onClick}
                type={type}
                disabled={disabled}
                className={style}
            >
                {label}
            </button>
        </div>
    );
}

export default Button;
