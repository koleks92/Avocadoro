import { SupabaseClient } from "@supabase/supabase-js";

// Sign In Google
export async function handleSignInWithGoogle(supabase: SupabaseClient, setMessage: React.Dispatch<React.SetStateAction<string>>): Promise<void> {
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
export async function handleSignInWithApple(supabase: SupabaseClient, setMessage: React.Dispatch<React.SetStateAction<string>>): Promise<void> {
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
