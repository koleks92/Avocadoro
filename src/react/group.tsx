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
import { cancelTransfer, finishTransfer, startTransfer } from "./util/startFinishTransfer";

type TransferTypes = "Recive" | "Send";

export default function Group() {
    const { id } = useParams<{ id: string }>();
    const { state } = useLocation();
    const navigate = useNavigate();

    // Modal
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const handleClose = () => setModalVisible(false);
    const [transferStatus, setTransferStatus] =
        useState<TransferTypes>("Recive");
    const [transferStatusText, setTransferStatusText] = useState<string>("");

    // Timer state from supabase
    const [supabaseFinishTime, setSupabaseFinishTime] = useState<string>("");

    // Timer state
    const [totalSeconds, setTotalSeconds] = useState<number>(0);

    const [timerView, setTimerView] = useState<boolean>(true);

    const [totalMinutes, setTotalMinutes] = useState<number>(
        state.total_minutes,
    );
    const [avocadoroAmount, setAvocadoroAmount] = useState<number>(0);
    const [totalTime, setTotalTime] = useState<string>("");

    // Supabase realtime database chanell
    const transferChannelRef = useRef<any>(null);

    // Transfer status
    const [transferRecived, setTransferRecived] = useState<boolean>(false);

    const {
        session,
        supabase,
        timerOn,
        setTimerOn,
        message,
        setMessage,
        timerMode,
    } = useContext(AvocadoroContext);

    function convertTime(): void {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        // Pad with leading zeros if needed
        const paddedHours = String(hours).padStart(2, "0");
        const paddedMinutes = String(minutes).padStart(2, "0");

        setTotalTime(`${paddedHours}h ${paddedMinutes}m`);
    }

    useEffect(() => {
        if (!timerOn) {
            setTransferStatus("Recive");
            setTransferStatusText("Ready to recive timer!");
        }

        if (timerOn) {
            setTransferStatus("Send");
            setTransferStatusText("Ready to send timer!");
        }
    }, [modalVisible]);

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
            ".group_second_div",
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

    // Transfer function
    const transferTimer = async (): Promise<void> => {
        if (transferStatus === "Recive") {
            const { data, error } = await supabase
                .from("session_groups")
                .select("timer_on, finish_time")
                .eq("id", id)
                .single();

            if (data?.timer_on) {
                setSupabaseFinishTime(data.finish_time);
                finishTransfer(supabase, id);
                setModalVisible(false);
            } else {
                setTransferStatusText("Transfer failed!\n Try again!");
            }
        }

        if (transferStatus === "Send") {
            if (timerMode === "focus") {
                startTransfer(supabase, totalSeconds, id);
                setTransferStatusText("Sending...");

                // Start listening
                transferChannelRef.current = supabase
                    .channel("transfer-channel")
                    .on(
                        "postgres_changes",
                        {
                            event: "UPDATE",
                            schema: "public",
                            table: "session_groups",
                            filter: `id=eq.${id}`,
                        },
                        (payload) => {
                            if (payload.new.transfer_status === "recived") {
                                setModalVisible(false);
                                stopListening();
                                setTransferRecived(true);
                                setTimeout(() => {
                                    setTransferRecived(false);
                                }, 5000);
                            }
                        },
                    )
                    .subscribe();

                // Stop after 30 seconds
                setTimeout(() => {
                    stopListening();
                    cancelTransfer(supabase, id);
                    setTransferStatusText("Transfer failed!\nTry again!");
                }, 30000);
            } else {
                setTransferStatusText("Cannot transfer break!")
            }
        }
    };

    const stopListening = () => {
        if (transferChannelRef.current) {
            supabase.removeChannel(transferChannelRef.current);
            transferChannelRef.current = null;
        }
    };

    async function onCompleteHandler(
        minutes: number,
        finishTime: number,
    ): Promise<void> {
        setMessage("");

        // Insert data
        const { data, error } = await supabase
            .from("sessions")
            .insert({
                session_group_id: id,
                duration_minutes: minutes,
                finish_time: new Date(finishTime).toISOString(),
            })
            .select();

        setAvocadoroAmount((prev) => prev + 1);
        setTotalMinutes((prev) => prev + state.focus_timer);

        if (error) {
            // setMessage(error.message);
            setMessage(
                "Cannot save data.\n Are you running a timer on another device ?",
            );
            setTimeout(() => {
                setMessage("");
            }, 15000);
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
                            setModalVisible(true);
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
