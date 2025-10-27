import "../index.css";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";


// Get .env and create supabase clinet
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Login() {
    const [session, setSession] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (session) {
            navigate("/dashboard");
        }
    }, [session]);

    async function signOut(): Promise<void> {
        const { error } = await supabase.auth.signOut();
    }

    if (!session) {
        return (
            <div className="test">
                <Auth
                    supabaseClient={supabase}
                    appearance={{ theme: ThemeSupa }}
                    providers={["google", "apple"]}
                    theme="dark"
                />
            </div>
        );
    } else {
        <div>Something went wrong ! Check your internet connection and restart the app</div>
    }
}

