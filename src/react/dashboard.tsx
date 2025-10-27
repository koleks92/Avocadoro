import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

// Get .env and create supabase clinet
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Dashboard() {
    const navigate = useNavigate();

    console.log("Here")

    async function signOut() {
        const { error } = await supabase.auth.signOut();

        navigate("/");
    }

    return (
        <div>
            Dashboard
            <button onClick={signOut}>Log out</button>
        </div>
    );
}
