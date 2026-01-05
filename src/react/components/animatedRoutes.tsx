import { Routes, Route, useLocation } from "react-router-dom";
import Login from "../login";
import Dashboard from "../dashboard";
import AddGroup from "../add_group";
import Group from "../group";
import Settings from "../settings";

import { AnimatePresence } from "framer-motion";

function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/add_group" element={<AddGroup />} />
                <Route path="/group/:id" element={<Group />} />
                <Route path="/edit_group/:id" element={<AddGroup />} />
                <Route path="/settings" element={<Settings />} />
            </Routes>
        </AnimatePresence>
    );
}

export default AnimatedRoutes;
