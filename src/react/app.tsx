import { BrowserRouter, HashRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { AvocadoroProvider } from "./store/AvocadoroContext";
import AnimatedRoutes from "./components/animatedRoutes";

export default function App() {
    return (
        <HashRouter>
            <AvocadoroProvider>
                <AnimatedRoutes />
            </AvocadoroProvider>
        </HashRouter>
    );
}

const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(<App />);
