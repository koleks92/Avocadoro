import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Get .env and create supabase clinet
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
type instrument = {
    id: number;
    name: string;
};

function App() {
    const [instruments, setInstruments] = useState<instrument[]>([]);

    useEffect(() => {
        getInstruments();
    }, []);

    async function getInstruments(): Promise<void> {
        const { data, error } = await supabase.from("instruments").select();
        if (error) {
            console.error("Error: ", error);
        }
        setInstruments(data);
        console.log(data);
    }

    return (
        <>
            <div>sss</div>
            <ul>
                {instruments.map((instrument) => (
                    <li key={instrument.name}>{instrument.name}</li>
                ))}
            </ul>
        </>
    );
}
const root = createRoot(document.body);
root.render(<App />);
