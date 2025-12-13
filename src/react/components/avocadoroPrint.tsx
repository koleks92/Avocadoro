import "../../index.css";
import logoNoSpace from "./../images/logo_nospace.png";

import { VirtuosoGrid, VirtuosoGridProps } from "react-virtuoso";
import { forwardRef } from "react";

type AvocadoroPrintProps = {
    amount: number;
};

const gridComponents: VirtuosoGridProps<undefined, undefined>["components"] = {
    List: forwardRef(({ style, children, ...props }, ref) => (
        <div
            ref={ref}
            {...props}
            style={{
                display: "flex",
                flexWrap: "wrap",
                ...style,
            }}
        >
            {children}
        </div>
    )),
    Item: ({ children, ...props }) => (
        <div
            {...props}
            style={{
                width: "2rem",
                margin: "0px",
                boxSizing: "border-box",
            }}
        >
            {children}
        </div>
    ),
};

function AvocadoroPrint({ amount }: AvocadoroPrintProps) {
    return (
        <VirtuosoGrid
            className="avocadoro_print_root"
            totalCount={amount}
            components={gridComponents}
            itemContent={(index) => (
                <img
                    key={index}
                    src={logoNoSpace}
                    className="avocadoro_print_image"
                />
            )}
        />
    );
}

export default AvocadoroPrint;
