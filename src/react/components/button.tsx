import "../../index.css";

type Props = {
    label: string;
    onClick?: () => void;
    type: "button" | "submit" | "reset";
    disabled?: boolean;
};

function Button({ label, onClick, type, disabled }: Props) {
    return (
        <div>
            <button
                onClick={onClick}
                type={type}
                disabled={disabled}
                className="custom_button"
            >
                {label}
            </button>
        </div>
    );
}

export default Button;
