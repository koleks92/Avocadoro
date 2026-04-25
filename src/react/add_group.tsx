import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { AvocadoroContext } from "./store/AvocadoroContext";
import Input from "./components/input";
import Button from "./components/button";
import { IoIosArrowBack } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";

import TimeSelector from "./components/timeSelector";
import MotionDiv from "./components/motionDiv";
import { useGroup } from "./hooks/useGroup";

export default function AddGroup() {
    const { id } = useParams<{ id: string }>();
    const { state } = useLocation();
    const navigate = useNavigate();

    const [deleteView, setDeleteView] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    const [anonymousMode, setAnonymousMode] = useState<boolean>(false);

    const [name, setName] = useState<string>("");
    const [focusTimer, setFocusTimer] = useState<number>(25);
    const [breakTimer, setBreakTimer] = useState<number>(5);

    const { session, supabase, message, setMessage } =
        useContext(AvocadoroContext);

    // Set initial states
    useEffect(() => {
        if (id && state && state.edit) {
            setName(state.name);
            setFocusTimer(state.focus_timer);
            setBreakTimer(state.break_timer);
            setLoading(false);
        } else if (state && state.anonymousMode) {
            setAnonymousMode(true);
            setLoading(false);
        } else {
            setLoading(false);
        }

        window.electronAPI.setTimer("");
    }, []);

    // useGroup Hook
    const { addNewGroupHandler, deleteGroup } = useGroup(
        supabase,
        navigate,
        setMessage,
        name,
        session,
        state,
        focusTimer,
        breakTimer,
    );

    if (!loading) {
        return (
            <MotionDiv>
                <div className="add_group_root">
                    {deleteView ? (
                        <>
                            <div className="login_logo_div">
                                <div className="delete_button_confirm_div">
                                    <Button
                                        label={<IoIosArrowBack />}
                                        type="button"
                                        style="custom_button button_logo go_back_button"
                                        onClick={() => {
                                            setDeleteView(false);
                                        }}
                                    />
                                </div>
                                <span className="add_group_title_span">
                                    Are you sure ?
                                </span>

                                <div className="delete_button_confirm_div">
                                    <Button
                                        label={<MdDeleteOutline />}
                                        type="button"
                                        style="custom_button button_logo delete_button_confirm"
                                        onClick={() => {
                                            deleteGroup();
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="add_group_main">
                                <span className="delete_span_text">
                                    This will delete your session group and all
                                    your focus minutes!
                                </span>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="login_logo_div">
                                <div className="add_group_back_button_div">
                                    <Button
                                        label={<IoIosArrowBack />}
                                        type="button"
                                        style="custom_button button_logo go_back_button"
                                        onClick={() => {
                                            navigate(-1);
                                        }}
                                    />
                                </div>
                                {!anonymousMode && (
                                    <>
                                        <span className="add_group_title_span">
                                            {state?.edit
                                                ? "Edit session group"
                                                : "Add new session group"}
                                        </span>
                                        {state?.edit ? (
                                            <div>
                                                <Button
                                                    label={<MdDeleteOutline />}
                                                    type="button"
                                                    style="custom_button button_logo delete_button"
                                                    onClick={() => {
                                                        setDeleteView(true);
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            <div
                                                style={{ visibility: "hidden" }}
                                            >
                                                <Button
                                                    label={<IoIosArrowBack />}
                                                    type="button"
                                                    style="custom_button button_logo"
                                                    onClick={() => {
                                                        navigate("/dashboard");
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                            <div className="add_group_main">
                                <form onSubmit={addNewGroupHandler}>
                                    {!anonymousMode && (
                                        <div className="center_column_div name_input">
                                            <label
                                                htmlFor="name"
                                                className="add_group_label"
                                            >
                                                Enter new session name
                                            </label>
                                            <Input
                                                type="text"
                                                placeholder="Avocadoro name"
                                                value={name}
                                                onChange={(e) =>
                                                    setName(e.target.value)
                                                }
                                            />
                                            {message ? (
                                                <span className="warning_span">
                                                    {message}
                                                </span>
                                            ) : (
                                                <span className="disabled_span">
                                                    Hidden message
                                                </span>
                                            )}
                                        </div>
                                    )}
                                    <div className="center_column_div focus_timer">
                                        <label
                                            htmlFor="focusTimer"
                                            className="add_group_label"
                                        >
                                            Select focus time in minutes
                                        </label>
                                        <TimeSelector
                                            min={5}
                                            max={60}
                                            step={5}
                                            defaultValue={focusTimer}
                                            onClick={(time) =>
                                                setFocusTimer(time)
                                            }
                                        />
                                    </div>
                                    <div className="center_column_div break_timer">
                                        <label
                                            htmlFor="breakTimer"
                                            className="add_group_label"
                                        >
                                            Select break time in minutes
                                        </label>
                                        <TimeSelector
                                            min={5}
                                            max={60}
                                            step={5}
                                            defaultValue={breakTimer}
                                            onClick={(time) =>
                                                setBreakTimer(time)
                                            }
                                        />
                                    </div>
                                    <div className="center_column_div extra_margin">
                                        {anonymousMode ? (
                                            <Button
                                                label={"Create"}
                                                type="button"
                                                style="custom_button"
                                                onClick={() => {
                                                    navigate(
                                                        "/anonymous_timer",
                                                        {
                                                            state: {
                                                                focusTimer:
                                                                    focusTimer,
                                                                breakTimer:
                                                                    breakTimer,
                                                            },
                                                        },
                                                    );
                                                }}
                                            />
                                        ) : (
                                            <Button
                                                label={
                                                    state?.edit
                                                        ? "Update"
                                                        : "Add"
                                                }
                                                type="submit"
                                                style="custom_button"
                                            />
                                        )}
                                    </div>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            </MotionDiv>
        );
    }
}
