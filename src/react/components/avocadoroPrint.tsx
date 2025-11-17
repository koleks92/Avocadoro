import logo from "./../images/Logo.png";
import logoNoSpace from "./../images/logo_nospace.png";

import "../../index.css";

type AvocadoroPrintProps = {
    amount: number;
};

function AvocadoroPrint({ amount }: AvocadoroPrintProps) {
    return (
        <div className="avocadoro_print_root">
            {Array.from({ length: amount }).map((_, i) => (
                <img key={i} src={logoNoSpace} className="avocadoro_print_image" />
            ))}{" "}
        </div>
    );
}

export default AvocadoroPrint;
