import "../index.css";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AvocadoroContext } from "./store/AvocadoroContext";

export default function Dashboard() {
    const { session, supabase } = useContext(AvocadoroContext);
    const navigate = useNavigate();

    async function signOut() {
        const { error } = await supabase.auth.signOut();

        navigate("/");
    }

    return (
        <div>
            Dashboard
            <button onClick={() => {navigate("/add_group")}}>Add new group</button>
            <button onClick={signOut}>Log out</button>
        </div>
    );
}
