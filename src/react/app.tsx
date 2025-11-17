import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { AvocadoroProvider } from "./store/AvocadoroContext";
import AnimatedRoutes from "./components/animatedRoutes";

export default function App() {
    return (
        <BrowserRouter>
            <AvocadoroProvider>
                <AnimatedRoutes />
            </AvocadoroProvider>
        </BrowserRouter>
    );
}

const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(<App />);
