import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AvocadoroContext } from "./store/AvocadoroContext";

export default function AddGroup() {
    const { session, supabase } = useContext(AvocadoroContext);
    const navigate = useNavigate();

    async function goBack() {
        navigate("/");
    }

    return (
        <div className="vertical_test">
            Add new avocadoro group
            <button onClick={goBack}>Go Back</button>
        </div>
    );
}
