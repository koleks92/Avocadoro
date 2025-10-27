import "../index.css";

import { useEffect, useState, useContext } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { AvocadoroContext } from "./store/AvocadoroContext";

export default function Login() {
    const { session, supabase } = useContext(AvocadoroContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (session) {
            navigate("/dashboard");
        }
    }, [session]);


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
        <div>
            Something went wrong ! Check your internet connection and restart
            the app
        </div>;
    }
}
