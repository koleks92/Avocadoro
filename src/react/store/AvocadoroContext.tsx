import { ReactNode, useState, useEffect, createContext } from "react";
import { createClient, SupabaseClient, Session } from "@supabase/supabase-js";

// Define the shape of the context value
type AvocadoroContextType = {
    supabase: SupabaseClient;
    session: Session | null;
    setSession: React.Dispatch<React.SetStateAction<Session | null>>;
    timerOn: boolean;
    setTimerOn: React.Dispatch<React.SetStateAction<boolean>>;
};

// Create the context (default: null so we can handle initialization)
export const AvocadoroContext = createContext<AvocadoroContextType | null>(
    null
);

// Define props type for the Provider
type AvocadoroProviderProps = {
    children: ReactNode;
};

// Create Supabase client
const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY!
);

// The provider itself
export function AvocadoroProvider({ children }: AvocadoroProviderProps) {
    const [session, setSession] = useState<Session | null>(null);
    const [timerOn, setTimerOn] = useState<boolean>(false);

    useEffect(() => {
        supabase.auth
            .getSession()
            .then(({ data: { session } }) => setSession(session));
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) =>
            setSession(session)
        );
        return () => subscription.unsubscribe();
    }, []);

    return (
        <AvocadoroContext.Provider value={{ supabase, session, setSession, timerOn, setTimerOn }}>
            {children}
        </AvocadoroContext.Provider>
    );
}
