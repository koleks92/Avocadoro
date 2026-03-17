import { useLocation, useNavigate } from "react-router-dom";
import MotionDiv from "./components/motionDiv";
import { useContext, useState } from "react";
import Button from "./components/button";
import { AvocadoroContext } from "./store/AvocadoroContext";
import { IoIosArrowBack } from "react-icons/io";
import Timer from "./components/timer";

export default function AnonymousTimer() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const { timerOn, setTimerOn, message, setMessage } =
        useContext(AvocadoroContext);

    const [focusTimer, setFocusTimer] = useState<number>(
        state.focusTimer || 25,
    );
    const [breakTimer, setBreakTimer] = useState<number>(state.breakTimer || 5);

    function goBackCheck(): void {
        if (timerOn) {
            setMessage("Reset the timer first");
        } else {
            navigate(-1);
        }
    }

    return (
        <MotionDiv>
            <div className="group_root">
                <div className="group_logo_div">
                    <div className="group_back_button_div">
                        <Button
                            onClick={() => goBackCheck()}
                            type="button"
                            style="custom_button button_logo_dashboard go_back_button"
                            label={<IoIosArrowBack />}
                        />
                    </div>
                </div>
                <div className="group_second_div">
                    <Timer
                        focusTimer={focusTimer}
                        breakTimer={breakTimer}
                    />
                    <span className="message_span">{message}</span>
                </div>
            </div>
        </MotionDiv>
    );
}
