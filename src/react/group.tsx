import { useParams, useLocation, useNavigate } from "react-router-dom";
import Timer from "./components/timer";
import { useContext, useEffect, useState, useRef } from "react";
import { AvocadoroContext } from "./store/AvocadoroContext";
import Button from "./components/button";
import { IoIosArrowBack, IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { IoPencil } from "react-icons/io5";
import { MdTransferWithinAStation } from "react-icons/md";
import AvocadoroPrint from "./components/avocadoroPrint";
import logoNoSpace from "./images/logo_nospace.png";
import MotionDiv from "./components/motionDiv";
import { Modal } from "@mui/material";
import { useTransfer } from "./hooks/useTransfer";
import { useGroupSession } from "./hooks/useGroupSession";

export default function Group() {
    const { id } = useParams<{ id: string }>();
    const { state } = useLocation();
    const navigate = useNavigate();

    const { supabase, timerOn, message, setMessage, timerMode } =
        useContext(AvocadoroContext);

    // useGroupSession hook
    const {
        totalSeconds,
        setTotalSeconds,
        timerView,
        setTimerView,
        avocadoroAmount,
        totalTime,
        onCompleteHandler,
    } = useGroupSession(supabase, id!, state, setMessage);

    // useTransfer hook
    const {
        modalVisible,
        setModalVisible,
        transferStatus,
        transferStatusText,
        transferRecived,
        supabaseFinishTime,
        openModal,
        transferTimer,
        handleClose,
    } = useTransfer(supabase, id!, timerOn, timerMode, totalSeconds);

    // Check timer to see if transfer is available
    useEffect(() => {
        const checkTimer = async (): Promise<void> => {
            const { data, error } = await supabase
                .from("session_groups")
                .select("timer_on, finish_time")
                .eq("id", id)
                .single();

            if (data?.timer_on) {
                setModalVisible(true);
            }
        };

        checkTimer();
    }, []);

    // Clean message
    useEffect(() => {
        if (!timerOn) setMessage("");
    }, [timerOn]);

    // Check if edit/goBack is available
    const editCheck = () =>
        timerOn
            ? setMessage("Reset the timer first")
            : navigate(`/edit_group/${state.id}`, {
                  state: { ...state, edit: true },
              });
    const goBackCheck = () =>
        timerOn ? setMessage("Reset the timer first") : navigate(-1);

    return (
        <MotionDiv>
            <Modal
                open={modalVisible}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className="modal_root" onClick={handleClose}>
                    <div
                        className="modal_div"
                        onClick={(e) => e.stopPropagation()} // prevent clicks inside from closing
                    >
                        <span className="modal_title">Transfer timer</span>
                        <Button
                            label={transferStatus}
                            onClick={() => transferTimer()}
                            type="button"
                            style="custom_button"
                        />
                        <span className="modal_span">{transferStatusText}</span>
                    </div>
                </div>
            </Modal>
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
                    <span className="dashboard_title_span">{state.name}</span>
                    <div>
                        <Button
                            onClick={() => {
                                editCheck();
                            }}
                            type="button"
                            style="custom_button button_logo_group edit_button"
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
                                        {totalTime}
                                    </span>
                                </div>
                                <div style={{ visibility: "hidden" }}>
                                    <img
                                        src={logoNoSpace}
                                        className="avocadoro_print_image"
                                    />
                                    - {state.focus_timer}m
                                </div>
                            </div>
                            <AvocadoroPrint amount={avocadoroAmount} />
                            <span className="message_span">{message}</span>
                        </div>

                        <div className="group_button_div">
                            <Button
                                onClick={() => setTimerView(true)}
                                type="button"
                                style="custom_button button_logo_group open_timer_button"
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
                                style="custom_button button_logo_group close_timer_button"
                                label={<IoIosArrowDown />}
                            />
                        </div>

                        <div className="group_second_div">
                            <Timer
                                onComplete={onCompleteHandler}
                                focusTimer={state.focus_timer}
                                breakTimer={state.break_timer}
                                supabaseId={state.id}
                                supabaseFinishTime={supabaseFinishTime}
                                onTotalSecondsChange={(seconds) =>
                                    setTotalSeconds(seconds)
                                }
                                transferRecived={transferRecived}
                            />
                            <span className="message_span">{message}</span>
                        </div>
                    </div>
                </div>
                <div className="dashboard_bottom_div">
                    <Button
                        onClick={() => {
                            openModal();
                        }}
                        type="button"
                        style="custom_button button_logo_group edit_button"
                        label={<MdTransferWithinAStation />}
                    />
                </div>
            </div>
        </MotionDiv>
    );
}
