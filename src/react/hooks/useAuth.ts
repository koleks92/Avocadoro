import { SupabaseClient } from "@supabase/supabase-js";
import { emailValidation, passwordValidation } from "../util/validation";
import { useState } from "react";

export function useAuth(
    supabase: SupabaseClient,
    setMessage: React.Dispatch<React.SetStateAction<string>>,
    setSignUpView: React.Dispatch<React.SetStateAction<boolean>>,
    email: string,
    password: string,
    confirmPassword: string,
) {
    const [passwordInvalid, setPasswordInvalid] = useState<boolean>(false);
    const [confirmPasswordInvalid, setConfirmPasswordInvalid] =
        useState<boolean>(false);
    const [emailInvalid, setEmailInvalid] = useState<boolean>(false);

    // Sign In function
    const signInHandler = async (): Promise<void> => {
        setMessage("");

        // Values validations
        const emailIsInvalid = !emailValidation(email);
        const passwordIsInvalid = !passwordValidation(password);

        setEmailInvalid(emailIsInvalid);
        setPasswordInvalid(passwordIsInvalid);

        if (!emailIsInvalid && !passwordIsInvalid) {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                console.error("Signin error:", error);
                setMessage(error.message);
                return;
            }

            if (data) {
                console.log("Signin success:", data);
            }
        }
    };

    // Sign Up function
    const signUpHandler = async (): Promise<void> => {
        setMessage("");

        // Values validations
        const emailIsInvalid = !emailValidation(email);
        const passwordIsInvalid = !passwordValidation(password);
        const confirmPasswordIsInvalid = password !== confirmPassword;

        setEmailInvalid(emailIsInvalid);
        setPasswordInvalid(passwordIsInvalid);
        setConfirmPasswordInvalid(confirmPasswordIsInvalid);

        if (
            !emailIsInvalid &&
            !passwordIsInvalid &&
            !confirmPasswordIsInvalid
        ) {
            const { data, error } = await supabase.auth.signUp({
                email: email.trim(),
                password: password.trim(),
            });

            if (error) {
                console.error("Signup error:", error);
                setMessage(error.message);

                return;
            }

            if (data) {
                console.log("Signup success:", data);
                setSignUpView(false);
            }
        }
    };

    // Google Sign In
    const signInWithGoogleHandler = async (): Promise<void> => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: "avocadoro://auth/callback",
            },
        });

        if (error) {
            console.error("Signup error:", error);
            setMessage(error.message);

            return;
        }
    };

    // Apple Sign In
    const signInWithAppleHandler = async (): Promise<void> => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "apple",
            options: {
                redirectTo:
                    "https://waahmuiugnnswpswwrah.supabase.co/auth/v1/callback",
            },
        });

        if (error) {
            console.error("Signup error:", error);
            setMessage(error.message);
            return;
        }
    };

    // Extra function to clear messages

    const clearMessages = (): void => {
        setMessage("");
        setPasswordInvalid(false);
        setEmailInvalid(false);
        setConfirmPasswordInvalid(false);
    };

    return {
        emailInvalid,
        passwordInvalid,
        confirmPasswordInvalid,
        signInHandler,
        signUpHandler,
        signInWithGoogleHandler,
        signInWithAppleHandler,
        clearMessages
    };
}
