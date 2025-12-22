import App from "./react/app";
import { createRoot } from "react-dom/client";

const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(<App />);