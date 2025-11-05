import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createRoot } from "react-dom/client";
import Login from "./login";
import Dashboard from "./dashboard";
import AddGroup from "./add_group";
import { AvocadoroProvider } from "./store/AvocadoroContext";
import Group from "./group";

export default function App() {
    return (
        <BrowserRouter>
            <AvocadoroProvider>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/add_group" element={<AddGroup />} />
                    <Route path="/group/:id" element={<Group />} />
                </Routes>
            </AvocadoroProvider>
        </BrowserRouter>
    );
}

const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(<App />);
