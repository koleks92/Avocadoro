import { ReactNode, useState, useEffect, createContext } from "react";
import { createClient, SupabaseClient, Session } from "@supabase/supabase-js";
import { JwtPayload } from "@supabase/supabase-js";

type timerModeType = "focus" | "break";

// Define the shape of the context value
type AvocadoroContextType = {
    supabase: SupabaseClient;
    session: Session | null;
    setSession: React.Dispatch<React.SetStateAction<Session | null>>;
    timerOn: boolean;
    setTimerOn: React.Dispatch<React.SetStateAction<boolean>>;
    message: string;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    timerMode: timerModeType;
    setTimerMode: React.Dispatch<React.SetStateAction<timerModeType>>;
    authLoaded: boolean;
    setAuthLoaded: React.Dispatch<React.SetStateAction<boolean>>;
};

// Create the context (default: null so we can handle initialization)
export const AvocadoroContext = createContext<AvocadoroContextType | null>(
    null,
);

// Define props type for the Provider
type AvocadoroProviderProps = {
    children: ReactNode;
};

// Create Supabase client
const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY!,
);

// The provider itself
export function AvocadoroProvider({ children }: AvocadoroProviderProps) {
    const [session, setSession] = useState<Session | null>(null);
    const [timerOn, setTimerOn] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [timerMode, setTimerMode] = useState<timerModeType>("focus");
    const [authLoaded, setAuthLoaded] = useState<boolean>(false);

    useEffect(() => {
        // 1. Get initial session on mount
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setAuthLoaded(true);
        });

        // 2. Listen for auth changes (handles email/password login, logout, token refresh)
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setAuthLoaded(true);
        });

        // 3. Handle Electron deep link OAuth redirects
        let cleanupDeepLink: (() => void) | null = null;

        if (window.electronAPI?.onDeepLinkUrl) {
            const deepLinkCleanup = window.electronAPI.onDeepLinkUrl(
                (url: string) => {
                    try {
                        const urlObject = new URL(url);
                        const hashParams = new URLSearchParams(
                            urlObject.hash.substring(1),
                        );

                        const access_token = hashParams.get("access_token");
                        const refresh_token = hashParams.get("refresh_token");

                        if (access_token && refresh_token) {
                            // setSession triggers onAuthStateChange above automatically
                            // so no need to manually setSession here
                            supabase.auth.setSession({
                                access_token,
                                refresh_token,
                            });
                        } else {
                            console.error("Tokens not found in deep link URL");
                        }
                    } catch (error) {
                        console.error("Error processing deep link URL:", error);
                    }
                },
            );

            cleanupDeepLink = () => deepLinkCleanup.listener.unsubscribe();
            window.electronAPI.setTimer("");
        }

        return () => {
            subscription.unsubscribe();
            cleanupDeepLink?.();
        };
    }, []);

    return (
        <AvocadoroContext.Provider
            value={{
                supabase,
                session,
                setSession,
                timerOn,
                setTimerOn,
                message,
                setMessage,
                timerMode,
                setTimerMode,
                authLoaded,
                setAuthLoaded,
            }}
        >
            {children}
        </AvocadoroContext.Provider>
    );
}
