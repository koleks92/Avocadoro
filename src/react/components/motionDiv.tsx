import { motion } from "framer-motion";
import { ReactNode } from "react";

type MotionDivProps = {
    children: ReactNode;
};

function MotionDiv({ children }: MotionDivProps) {
    return (
        <motion.div
            initial={{ opacity: 0, transition: {duration: 0.4}  }}
            animate={{ opacity: 1, transition: {duration: 0.4}  }}
            exit={{ opacity: 0, transition: {duration: 0.4} }}
        >
            {children}
        </motion.div>
    );
}

export default MotionDiv;