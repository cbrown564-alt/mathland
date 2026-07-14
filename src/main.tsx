import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { installOperationalMonitoring } from "./world/operations/monitoring";

installOperationalMonitoring();

createRoot(document.getElementById("root")!).render(<App />);
