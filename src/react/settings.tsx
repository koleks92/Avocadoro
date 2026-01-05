import { useNavigate } from "react-router-dom";
import Button from "./components/button";
import MotionDiv from "./components/motionDiv";
import { IoIosArrowBack } from "react-icons/io";

export default function Settings() {
    const navigate = useNavigate();

    return (
        <MotionDiv>
            <div className="settings_root">
                <div className="group_logo_div">
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
            </div>
        </MotionDiv>
    );
}
