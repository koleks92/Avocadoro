import { SupabaseClient } from "@supabase/supabase-js";
import { emailValidation, passwordValidation } from "./validation";

// Sign In Email
export async function signInHandler(
    supabase: SupabaseClient,
    setMessage: React.Dispatch<React.SetStateAction<string>>,
    email: string,
    password: string,
    setEmailInvalid: React.Dispatch<React.SetStateAction<boolean>>,
    setPasswordInvalid: React.Dispatch<React.SetStateAction<boolean>>,
): Promise<void> {
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
}

// Sign Up
export async function signUpHandler(
    supabase: SupabaseClient,
    setMessage: React.Dispatch<React.SetStateAction<string>>,
    email: string,
    password: string,
    confirmPassword: string,
    setEmailInvalid: React.Dispatch<React.SetStateAction<boolean>>,
    setPasswordInvalid: React.Dispatch<React.SetStateAction<boolean>>,
    setConfirmPasswordInvalid: React.Dispatch<React.SetStateAction<boolean>>,
    setSignUpView: React.Dispatch<React.SetStateAction<boolean>>,
): Promise<void> {
    setMessage("");

    // Values validations
    const emailIsInvalid = !emailValidation(email);
    const passwordIsInvalid = !passwordValidation(password);
    const confirmPasswordIsInvalid = password !== confirmPassword;

    setEmailInvalid(emailIsInvalid);
    setPasswordInvalid(passwordIsInvalid);
    setConfirmPasswordInvalid(confirmPasswordIsInvalid);

    if (!emailIsInvalid && !passwordIsInvalid && !confirmPasswordIsInvalid) {
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
}

// Sign In Google
export async function handleSignInWithGoogle(
    supabase: SupabaseClient,
    setMessage: React.Dispatch<React.SetStateAction<string>>,
): Promise<void> {
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
}

// Sign In Apple
export async function handleSignInWithApple(
    supabase: SupabaseClient,
    setMessage: React.Dispatch<React.SetStateAction<string>>,
): Promise<void> {
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
}

// Delete account function
export async function deleteAccount(supabase: SupabaseClient): Promise<void> {
    const { error: rpcError } = await supabase.rpc("delete_user");

    if (rpcError) {
        console.error("Error deleting account via RPC:", rpcError.message);
        return;
    }

    await supabase.auth.signOut();
}
