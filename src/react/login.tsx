import "../index.css";

import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AvocadoroContext } from "./store/AvocadoroContext";
import Input from "./components/input";
import Button from "./components/button";
import Loading from "./components/loading";

export default function Login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [loading, setLoading] = useState(true);

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

    async function handleSignInWithGoogle() {
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

    async function handleSignInWithApple() {
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

    if (loading) {
        return (
        <Loading />
        )
    }

    if (!session) {
        return (
            <div className="test">
                {signUpView ? (
                    <div>
                        <div>
                            <Button
                                label="Go back"
                                type="button"
                                onClick={() => {
                                    setSignUpView(false);
                                }}
                            />
                        </div>

                        <form onSubmit={signUpHandler}>
                            <div>
                                <label htmlFor="email">Enter your email</label>
                                <Input
                                    type="email"
                                    placeholder="Type email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                {emailInvalid ? (
                                    <span style={{ color: "red" }}>
                                        Invalid email
                                    </span>
                                ) : (
                                    <br />
                                )}
                            </div>
                            <div>
                                <label htmlFor="password">
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
                                    <span style={{ color: "red" }}>
                                        Password must be ≥ 10 chars and include
                                        a number
                                    </span>
                                ) : (
                                    <br />
                                )}
                            </div>
                            <div>
                                <label htmlFor="password">
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
                                    <span style={{ color: "red" }}>
                                        Typed passwords are not the same
                                    </span>
                                ) : (
                                    <br />
                                )}
                            </div>
                            {signUpMessage}
                            <div>
                                <Button label="Sign Up" type="submit" />
                            </div>
                        </form>
                    </div>
                ) : (
                    <form onSubmit={signInHandler}>
                        <div>
                            <label htmlFor="email">Enter your email</label>
                            <Input
                                type="email"
                                placeholder="Type email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {emailInvalid ? (
                                <span style={{ color: "red" }}>
                                    Invalid email
                                </span>
                            ) : (
                                <br />
                            )}
                        </div>
                        <div>
                            <label htmlFor="password">
                                Enter your password
                            </label>
                            <Input
                                type="password"
                                placeholder="Type password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {passwordInvalid ? (
                                <span style={{ color: "red" }}>
                                    Password must be ≥ 10 chars and include a
                                    number
                                </span>
                            ) : (
                                <br />
                            )}
                        </div>

                        <div>
                            <Button label="Log in" type="submit" />
                            <Button
                                label="Don't have an account yet"
                                type="button"
                                onClick={() => setSignUpView(true)}
                            />
                            <Button
                                type="button"
                                label="Google"
                                onClick={() => handleSignInWithGoogle()}
                            />
                            <Button
                                type="button"
                                label="Apple"
                                onClick={() => handleSignInWithApple()}
                            />
                        </div>
                    </form>
                )}
            </div>
        );
    }
}
