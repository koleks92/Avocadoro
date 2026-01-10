import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { AvocadoroContext } from "./store/AvocadoroContext";
import Input from "./components/input";
import Button from "./components/button";
import { IoIosArrowBack } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";

import TimeSelector from "./components/timeSelector";
import Loading from "./components/loading";
import MotionDiv from "./components/motionDiv";

export default function AddGroup() {
    const { id } = useParams<{ id: string }>();
    const { state } = useLocation();
    const navigate = useNavigate();

    const [deleteView, setDeleteView] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    const [name, setName] = useState<string>("");
    const [focusTimer, setFocusTimer] = useState<number>(25);
    const [breakTimer, setBreakTimer] = useState<number>(5);
    const [message, setMessage] = useState<string>("");

    const { session, supabase } = useContext(AvocadoroContext);

    useEffect(() => {
        if (id && state && state.edit) {
            setName(state.name);
            setFocusTimer(state.focus_timer);
            setBreakTimer(state.break_timer);
            setLoading(false);
        } else {
            setLoading(false);
        }

        window.electronAPI.setTimer("");
    }, []);

    async function addNewGroupHandler(e: React.FormEvent): Promise<void> {
        e.preventDefault();

        setMessage("");

        // Check if name provided
        if (!name || name === "") {
            setMessage("Missing avocadoro name");
            return;
        }

        // Double check if logged in correctly
        if (!session.user.id) {
            setMessage("Something went wrong, please try again!");
            return;
        }

        // Check if already in database
        const { data: existingGroup, error: fetchError } = await supabase
            .from("session_groups")
            .select("*")
            .eq("user_id", session.user.id)
            .eq("name", name.trim())
            .maybeSingle();

        if (fetchError) {
            console.error("Error checking for existing group:", fetchError);
            return;
        }

        if (existingGroup && existingGroup.id != state?.id) {
            setMessage("You already have a group with that name.");
            return;
        }

        if (state?.edit) {
            // Edit data
            const { data, error } = await supabase
                .from("session_groups")
                .update({
                    name: name.trim(),
                    focus_timer: focusTimer,
                    break_timer: breakTimer,
                })
                .eq("id", state.id)
                .select();

            if (data) {
                navigate("/dashboard");
            }

            if (error) {
                setMessage(error.message);
            }
        } else {
            // Insert new data
            const { data, error } = await supabase
                .from("session_groups")
                .insert({
                    user_id: session.user.id,
                    name: name.trim(),
                    focus_timer: focusTimer,
                    break_timer: breakTimer,
                })
                .select();

            if (data) {
                navigate("/dashboard");
            }

            if (error) {
                setMessage(error.message);
            }
        }
    }

    async function deleteGroup(): Promise<void> {
        const { data, error } = await supabase
            .from("session_groups")
            .delete()
            .eq("id", state.id)
            .select();

        if (error) {
            setMessage(error.message);
        }

        if (data) {
            navigate("/dashboard");
        }
    }

    if (!loading) {
        return (
            <MotionDiv>
                <div className="add_group_root">
                    {deleteView ? (
                        <>
                            <div className="login_logo_div">
                                <div>
                                    <Button
                                        label={<IoIosArrowBack />}
                                        type="button"
                                        style="custom_button button_logo"
                                        onClick={() => {
                                            setDeleteView(false);
                                        }}
                                    />
                                </div>
                                <span className="add_group_title_span">
                                    Are you sure ?
                                </span>

                                <div>
                                    <Button
                                        label={<MdDeleteOutline />}
                                        type="button"
                                        style="custom_button button_logo"
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
                                <div>
                                    <Button
                                        label={<IoIosArrowBack />}
                                        type="button"
                                        style="custom_button button_logo go_back_button"
                                        onClick={() => {
                                            navigate(-1);
                                        }}
                                    />
                                </div>
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
                                            style="custom_button button_logo"
                                            onClick={() => {
                                                setDeleteView(true);
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div style={{ visibility: "hidden" }}>
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
                            </div>
                            <div className="add_group_main">
                                <form onSubmit={addNewGroupHandler}>
                                    <div className="center_column_div">
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
                                    <div className="center_column_div">
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
                                    <div className="center_column_div">
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
                                        <Button
                                            label={
                                                state?.edit ? "Update" : "Add"
                                            }
                                            type="submit"
                                            style="custom_button"
                                        />
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
