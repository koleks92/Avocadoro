import "../index.css";

import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AvocadoroContext } from "./store/AvocadoroContext";
import Input from "./components/input";
import Button from "./components/button";
import Loading from "./components/loading";
import { FaGoogle, FaApple } from "react-icons/fa";
import { SiApple } from "react-icons/si";
import { IoIosArrowBack } from "react-icons/io";
import logo from "./images/Logo.png";
import logoText from "./images/logo_text.png";

export default function Login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [message, setMessage] = useState<string>("");

    const [signUpView, setSignUpView] = useState<boolean>(false);
    const [signUpMessage, setSignUpMessage] = useState<string>();

    const [passwordInvalid, setPasswordInvalid] = useState<boolean>(false);
    const [confirmPasswordInvalid, setConfirmPasswordInvalid] =
        useState<boolean>(false);
    const [emailInvalid, setEmailInvalid] = useState<boolean>(false);

    const { session, supabase, setSession } = useContext(AvocadoroContext);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000); // minimum 1s loader

        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
            setLoading(false); // stops as soon as session known (after min delay)
        });

        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session);
            }
        );

        return () => {
            clearTimeout(timer);
            listener.subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (session) {
            navigate("/dashboard");
        }
    }, [session]);

    async function signInHandler(e: React.FormEvent): Promise<void> {
        e.preventDefault();

        setMessage("");

        // Email validation: must include "@" and "."
        const emailIsInvalid = !email.includes("@") || !email.includes(".");
        setEmailInvalid(emailIsInvalid);

        // Password validation:
        // must be >= 10 characters and contain at least 1 digit
        const passwordIsInvalid = password.length < 10 || !/\d/.test(password); // \d checks for a digit
        setPasswordInvalid(passwordIsInvalid);

        if (!emailIsInvalid && !passwordIsInvalid) {
            setLoading(true);
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                console.error("Signin error:", error);
                setLoading(false);
                setMessage(error.message);
                return;
            }

            if (data) {
                console.log("Signin success:", data);
                setLoading(false);
            }
        }
    }

    async function signUpHandler(e: React.FormEvent): Promise<void> {
        e.preventDefault();

        // Email validation: must include "@" and "."
        const emailIsInvalid = !email.includes("@") || !email.includes(".");
        setEmailInvalid(emailIsInvalid);

        // Password validation:
        // must be >= 10 characters and contain at least 1 digit
        const passwordIsInvalid = password.length < 10 || !/\d/.test(password); // \d checks for a digit
        setPasswordInvalid(passwordIsInvalid);

        // Confirm password validation
        // must be the same as password
        const confirmPasswordIsInvalid = password !== confirmPassword;
        setConfirmPasswordInvalid(confirmPasswordIsInvalid);

        if (
            !emailIsInvalid &&
            !passwordIsInvalid &&
            !confirmPasswordIsInvalid
        ) {
            setLoading(true);
            const { data, error } = await supabase.auth.signUp({
                email: email.trim(),
                password: password.trim(),
            });

            if (error) {
                console.error("Signup error:", error);
                setSignUpMessage(error.message);
                setLoading(false);

                return;
            }

            if (data) {
                console.log("Signup success:", data);
                setSignUpView(false);
                setLoading(false);
            }
        }
    }

    async function handleSignInWithGoogle(): Promise<void> {
        setLoading(true);

        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
        });

        if (error) {
            console.error("Signup error:", error);
            setSignUpMessage(error.message);
            setLoading(false);

            return;
        }
    }

    async function handleSignInWithApple(): Promise<void> {
        setLoading(true);

        const { error } = await supabase.auth.signInWithOAuth({
            provider: "apple",
            options: {
                redirectTo:
                    "https://waahmuiugnnswpswwrah.supabase.co/auth/v1/callback",
            },
        });

        if (error) {
            console.error("Signup error:", error);
            setSignUpMessage(error.message);
            setLoading(false);
            return;
        }
    }

    function clearMessages(): void {
        setMessage("");
        setPasswordInvalid(false);
        setEmailInvalid(false);
        setConfirmPasswordInvalid(false);
    }

    if (loading) {
        return <Loading />;
    }

    if (!session) {
        return (
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
                    <img src={logo} alt="Avocadoro" className="login_logo" />
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
                        <form onSubmit={signUpHandler}>
                            <div className="center_column_div">
                                <label htmlFor="email" className="login_label">
                                    Enter your email
                                </label>
                                <Input
                                    type="email"
                                    placeholder="Type email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                                        Password must be ≥ 10 chars and include
                                        a number
                                    </span>
                                ) : (
                                    <span className="disabled_span">
                                        Password must be ≥ 10 chars and include
                                        a number
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
                                    <span className="disabled_span">
                                        Typed passwords are not the same
                                    </span>
                                )}
                            </div>
                            {signUpMessage}
                            <div className="center_column_div">
                                <Button
                                    label="Sign Up"
                                    type="submit"
                                    style="custom_button"
                                />
                            </div>
                        </form>
                    ) : (
                        // Sign In View
                        <form onSubmit={signInHandler}>
                            <div className="center_column_div">
                                <label htmlFor="email" className="login_label">
                                    Enter your email
                                </label>
                                <Input
                                    type="email"
                                    placeholder="Type email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                                        Password must be ≥ 10 chars and include
                                        a number
                                    </span>
                                ) : (
                                    <span className="disabled_span">
                                        Password must be ≥ 10 chars and include
                                        a number
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
                                    type="submit"
                                    style="custom_button"
                                />
                                <div className="center_row_div">
                                    <Button
                                        type="button"
                                        style="custom_button button_logo"
                                        label={<FaGoogle />}
                                        onClick={() => handleSignInWithGoogle()}
                                    />
                                    <Button
                                        type="button"
                                        style="custom_button button_logo"
                                        label={<SiApple />}
                                        onClick={() => handleSignInWithApple()}
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
                            </div>
                        </form>
                    )}
                </div>
            </div>
        );
    }
}
