import { useNavigate } from "react-router-dom";

import Button from "./components/button";
import MotionDiv from "./components/motionDiv";
import { IoIosArrowBack } from "react-icons/io";
import { useContext, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { AvocadoroContext } from "./store/AvocadoroContext";

export default function Settings() {
    const [removeView, setRemoveView] = useState(false);

    const navigate = useNavigate();
    const { session, supabase } = useContext(AvocadoroContext);

    const deleteAccount = async (): Promise<void> => {
        const { error: rpcError } = await supabase.rpc("delete_user");

        if (rpcError) {
            console.error("Error deleting account via RPC:", rpcError.message);
            return;
        }

        await supabase.auth.signOut();
        navigate("/", { replace: true });
    };

    return (
        <MotionDiv>
            <div className="settings_root">
                <div className="settings_logo_div">
                    <div>
                        <Button
                            onClick={() => navigate(-1)}
                            type="button"
                            style="custom_button button_logo_dashboard"
                            label={<IoIosArrowBack />}
                        />
                    </div>
                    <span className="dashboard_title_span">Settings</span>
                    <div style={{ visibility: "hidden" }}>
                        <Button
                            onClick={() => navigate(-1)}
                            type="button"
                            style="custom_button button_logo_dashboard"
                            label={<IoIosArrowBack />}
                        />
                    </div>
                </div>
                <div className="settings_main_div">
                    {removeView ? (
                        <div className="settings_confirm_div">
                            <span className="settings_title_span">
                                We're sorry to see you go. If you delete your
                                account, you’ll lose access to your progress and
                                saved settings forever.
                            </span>

                            <Button
                                label={<MdDeleteOutline />}
                                type="button"
                                style="custom_button button_logo_dashboard"
                                onClick={() => {
                                    deleteAccount();
                                }}
                            />
                        </div>
                    ) : (
                        <Button
                            onClick={() => setRemoveView(true)}
                            type="button"
                            style="custom_button "
                            label="Remove account"
                        />
                    )}
                </div>
            </div>
        </MotionDiv>
    );
}
