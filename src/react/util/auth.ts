import { SupabaseClient } from "@supabase/supabase-js";



// Delete account function
export async function deleteAccount(supabase: SupabaseClient): Promise<void> {
    const { error: rpcError } = await supabase.rpc("delete_user");

    if (rpcError) {
        console.error("Error deleting account via RPC:", rpcError.message);
        return;
    }

    await supabase.auth.signOut();
}
