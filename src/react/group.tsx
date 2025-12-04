import { useParams, useLocation, useNavigate } from "react-router-dom";
import Timer from "./components/timer";
import { useContext, useEffect, useState } from "react";
import { AvocadoroContext } from "./store/AvocadoroContext";
import Button from "./components/button";
import { IoIosArrowBack, IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { IoPencil } from "react-icons/io5";
import AvocadoroPrint from "./components/avocadoroPrint";
import logoNoSpace from "./images/logo_nospace.png";
import MotionDiv from "./components/motionDiv";

export default function Group() {
    const { id } = useParams<{ id: string }>();
    const { state } = useLocation();
    const navigate = useNavigate();

    const [timerView, setTimerView] = useState<boolean>(true);

    const [message, setMessage] = useState<string>("");

    const [totalMinutes, setTotalMinutes] = useState<number>(
        state.total_minutes
    );
    const [avocadoroAmount, setAvocadoroAmount] = useState<number>(0);
    const [totalTime, setTotalTime] = useState<string>("");

    const { session, supabase, timerOn, setTimerOn } =
        useContext(AvocadoroContext);

    function convertTime(): void {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        // Pad with leading zeros if needed
        const paddedHours = String(hours).padStart(2, "0");
        const paddedMinutes = String(minutes).padStart(2, "0");

        setTotalTime(`${paddedHours}h ${paddedMinutes}m`);
    }

    useEffect(() => {
        setAvocadoroAmount(Math.floor(totalMinutes / state.focus_timer));
        convertTime();
    }, [totalMinutes]);

    useEffect(() => {
        if (!timerOn) setMessage("");
    }, [timerOn]);

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;

        const el = document.querySelector(
            ".group_second_div"
        ) as HTMLElement | null;

        if (timerView === false && el) {
            timeout = setTimeout(() => {
                el.classList.add("delay-scroll");
            }, 500);
        } else if (el) {
            el.classList.remove("delay-scroll");
        }

        return () => clearTimeout(timeout);
    }, [timerView]);

    async function onCompleteHandler(minutes: number): Promise<void> {
        setMessage("");

        // Insert data
        const { data, error } = await supabase
            .from("sessions")
            .insert({
                session_group_id: id,
                duration_minutes: minutes,
            })
            .select();

        setAvocadoroAmount((prev) => prev + 1);
        setTotalMinutes((prev) => prev + state.focus_timer);

        if (error) {
            setMessage(error.message);
        }
    }

    function editCheck(): void {
        if (timerOn) {
            setMessage("Reset the timer first");
        } else {
            navigate(`/edit_group/${state.id}`, {
                state: { ...state, edit: true },
            });
        }
    }

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
                    <div>
                        <Button
                            onClick={() => goBackCheck()}
                            type="button"
                            style="custom_button button_logo_dashboard"
                            label={<IoIosArrowBack />}
                        />
                    </div>
                    <span className="dashboard_title_span">{state.name}</span>
                    <div>
                        <Button
                            onClick={() => {
                                editCheck();
                            }}
                            type="button"
                            style="custom_button button_logo_group"
                            label={<IoPencil />}
                        />
                    </div>
                </div>
                <div className="group_div_main">
                    {/* Results view */}
                    <div
                        className={`group_result_div ${timerView ? "group_hidden_view" : "group_shown_view"}`}
                    >
                        <div className="group_second_div">
                            <div className="group_second_div_top">
                                <div className="group_second_div_top_div">
                                    <img
                                        src={logoNoSpace}
                                        className="avocadoro_print_image"
                                    />{" "}
                                    <span className="group_second_div_top_text">
                                        = {state.focus_timer}m
                                    </span>
                                </div>
                                <div className="group_second_text">
                                    <span className="group_second_div_title">
                                        Total focus time
                                    </span>
                                    <span className="group_second_div_time">
                                        {" "}
                                        {totalTime}
                                    </span>
                                </div>
                                <div style={{ visibility: "hidden" }}>
                                    <img
                                        src={logoNoSpace}
                                        className="avocadoro_print_image"
                                    />{" "}
                                    - {state.focus_timer}m
                                </div>
                            </div>
                            <AvocadoroPrint amount={avocadoroAmount} />
                            {message}
                        </div>

                        <div className="group_button_div">
                            <Button
                                onClick={() => setTimerView(true)}
                                type="button"
                                style="custom_button button_logo_group"
                                label={<IoIosArrowUp />}
                            />
                        </div>
                    </div>
                    {/* Timer view */}
                    <div
                        className={`group_timer_div ${timerView ? "group_shown_view" : "group_hidden_view"}`}
                    >
                        <div className="group_button_div">
                            <Button
                                onClick={() => setTimerView(false)}
                                type="button"
                                style="custom_button button_logo_group"
                                label={<IoIosArrowDown />}
                            />
                        </div>

                        <div className="group_second_div">
                            <Timer
                                onComplete={onCompleteHandler}
                                focus_timer={state.focus_timer}
                                break_timer={state.break_timer}
                            />
                            <span className="message_span">{message}</span>
                        </div>
                    </div>
                </div>
            </div>
        </MotionDiv>
    );
}
