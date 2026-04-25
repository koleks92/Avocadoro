import "../index.css";

import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AvocadoroContext } from "./store/AvocadoroContext";
import Input from "./components/input";
import Button from "./components/button";
import { FaGoogle, FaApple } from "react-icons/fa";
import { SiApple } from "react-icons/si";
import { IoIosArrowBack } from "react-icons/io";
import logo from "./images/Logo.png";
import MotionDiv from "./components/motionDiv";
import { useAuth } from "./hooks/useAuth";

export default function Login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    const [signUpView, setSignUpView] = useState<boolean>(false);

    const { session, supabase, message, setMessage, authLoaded } =
        useContext(AvocadoroContext);

    const navigate = useNavigate();

    // useAuth hook
    const {
        emailInvalid,
        passwordInvalid,
        confirmPasswordInvalid,
        signInHandler,
        signUpHandler,
        signInWithGoogleHandler,
        signInWithAppleHandler,
        clearMessages,
    } = useAuth(
        supabase,
        setMessage,
        setSignUpView,
        email,
        password,
        confirmPassword,
    );

    // Check is session if avaliable
    useEffect(() => {
        if (!authLoaded) return; // prevent early redirect flicker
        if (session) {
            navigate("/dashboard");
        }
    }, [authLoaded, session]);

    if (!session) {
        return (
            <MotionDiv>
                <div className="login_root">
                    <div className="login_logo_div">
                        <div>
                            {signUpView && (
                                <Button
                                    label={<IoIosArrowBack />}
                                    type="button"
                                    style="custom_button button_logo"
                                    onClick={() => {
                                        {
                                            setSignUpView(false);
                                            clearMessages();
                                        }
                                    }}
                                />
                            )}
                        </div>
                        <img
                            src={logo}
                            alt="Avocadoro"
                            className="login_logo"
                        />
                        <div style={{ visibility: "hidden" }}>
                            {signUpView && (
                                <Button
                                    label={<IoIosArrowBack />}
                                    type="button"
                                    style="custom_button button_logo"
                                    onClick={() => {
                                        {
                                            setSignUpView(false);
                                            clearMessages();
                                        }
                                    }}
                                />
                            )}
                        </div>
                    </div>
                    <div className="login_main_div">
                        {signUpView ? (
                            // Sign Up View
                            <div>
                                <div className="center_column_div">
                                    <label
                                        htmlFor="email"
                                        className="login_label"
                                    >
                                        Enter your email
                                    </label>
                                    <Input
                                        type="email"
                                        placeholder="Type email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                    />
                                    {emailInvalid ? (
                                        <span className="warning_span">
                                            Invalid email
                                        </span>
                                    ) : (
                                        <span className="disabled_span">
                                            Invalid email
                                        </span>
                                    )}
                                </div>
                                <div className="center_column_div">
                                    <label
                                        htmlFor="password"
                                        className="login_label"
                                    >
                                        Enter your password
                                    </label>
                                    <Input
                                        type="password"
                                        placeholder="Type password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                    />
                                    {passwordInvalid ? (
                                        <span className="warning_span">
                                            Password must be ≥ 10 chars and
                                            include a number
                                        </span>
                                    ) : (
                                        <span className="disabled_span">
                                            Password must be ≥ 10 chars and
                                            include a number
                                        </span>
                                    )}
                                </div>
                                <div className="center_column_div">
                                    <label
                                        htmlFor="password"
                                        className="login_label"
                                    >
                                        Confirm your password
                                    </label>
                                    <Input
                                        type="password"
                                        placeholder="Confirm password"
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(e.target.value)
                                        }
                                    />
                                    {confirmPasswordInvalid ? (
                                        <span className="warning_span">
                                            Typed passwords are not the same
                                        </span>
                                    ) : (
                                        <span className="signup_message warning_span">
                                            {message}
                                        </span>
                                    )}
                                </div>
                                <div className="center_column_div">
                                    <Button
                                        label="Sign Up"
                                        type="button"
                                        style="custom_button"
                                        onClick={() => signUpHandler()}
                                    />
                                </div>
                            </div>
                        ) : (
                            // Sign In View
                            <div>
                                <div className="center_column_div">
                                    <label
                                        htmlFor="email"
                                        className="login_label"
                                    >
                                        Enter your email
                                    </label>
                                    <Input
                                        type="email"
                                        placeholder="Type email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                    />
                                    {emailInvalid ? (
                                        <span className="warning_span">
                                            Invalid email
                                        </span>
                                    ) : (
                                        <span className="disabled_span">
                                            Invalid email
                                        </span>
                                    )}
                                </div>
                                <div className="center_column_div">
                                    <label
                                        htmlFor="password"
                                        className="login_label"
                                    >
                                        Enter your password
                                    </label>
                                    <Input
                                        type="password"
                                        placeholder="Type password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                    />
                                    {passwordInvalid ? (
                                        <span className="warning_span">
                                            Password must be ≥ 10 chars and
                                            include a number
                                        </span>
                                    ) : (
                                        <span className="disabled_span">
                                            Password must be ≥ 10 chars and
                                            include a number
                                        </span>
                                    )}
                                    {message ? (
                                        <span className="warning_span">
                                            Invalid email or password
                                        </span>
                                    ) : (
                                        <span className="disabled_span">
                                            Invalid email or password
                                        </span>
                                    )}
                                </div>

                                <div className="center_column_div">
                                    <Button
                                        label="Log in"
                                        type="button"
                                        style="custom_button"
                                        onClick={() => signInHandler()}
                                    />
                                    <div className="center_row_div">
                                        <Button
                                            type="button"
                                            style="custom_button button_logo"
                                            label={<FaGoogle />}
                                            onClick={() =>
                                                signInWithGoogleHandler()
                                            }
                                        />
                                        <Button
                                            type="button"
                                            style="custom_button button_logo"
                                            label={<SiApple />}
                                            onClick={() =>
                                                signInWithAppleHandler()
                                            }
                                        />
                                    </div>
                                    <Button
                                        label="Don't have an account yet"
                                        type="button"
                                        style="custom_button button_nobg"
                                        onClick={() => {
                                            setSignUpView(true);
                                            clearMessages();
                                        }}
                                    />
                                    <Button
                                        label="Continue without an account"
                                        type="button"
                                        style="custom_button button_nobg anonymous_button"
                                        onClick={() => {
                                            navigate("/add_group", {
                                                state: {
                                                    anonymousMode: true,
                                                },
                                            });
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </MotionDiv>
        );
    }
}
