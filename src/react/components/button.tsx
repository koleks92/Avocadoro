import "../../index.css";

type Props = {
    label: string;
    onClick?: () => void;
    type: "button" | "submit" | "reset";
    style?: "standard" | "noBackground";
    disabled?: boolean;
};

function Button({ label, onClick, type, style, disabled }: Props) {
    return (
        <div>
            <button
                onClick={onClick}
                type={type}
                disabled={disabled}
                className={`custom_button ${style} ${style === "noBackground" && "button_nobg"}`}
            >
                {label}
            </button>
        </div>
    );
}

export default Button;
