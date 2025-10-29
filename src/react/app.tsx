import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createRoot } from "react-dom/client";
import Login from "./login";
import Dashboard from "./dashboard";
import { AvocadoroProvider } from "./store/AvocadoroContext";

export default function App() {
    return (
        <BrowserRouter>
            <AvocadoroProvider>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
            </AvocadoroProvider>
        </BrowserRouter>
    );
}


const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(<App />);
