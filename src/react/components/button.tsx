import "../../index.css";
import { ReactNode } from "react";

type Props = {
    label: ReactNode;
    onClick?: () => void;
    onDoubleClick?: () => void;
    type: "button" | "submit" | "reset";
    style?: string;
    disabled?: boolean;
};

function Button({
    label,
    onClick,
    onDoubleClick,
    type,
    style,
    disabled,
}: Props) {
    return (
        <div>
            <button
                onClick={onClick}
                onDoubleClick={onDoubleClick}
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
