import { HashRouter } from "react-router-dom";
import { AvocadoroProvider } from "./store/AvocadoroContext";
import AnimatedRoutes from "./components/animatedRoutes";

export default function App() { // Use default export here for cleaner imports
    return (
        <HashRouter>
            <AvocadoroProvider>
                <AnimatedRoutes />
            </AvocadoroProvider>
        </HashRouter>
    );
}