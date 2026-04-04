import { createRoot } from "react-dom/client";
import { setBaseUrl } from "@workspace/api-client-react";
import App from "./App";
import "./index.css";

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const isAbsoluteHttpUrl =
	!!configuredApiBaseUrl && /^https?:\/\//i.test(configuredApiBaseUrl);

setBaseUrl(isAbsoluteHttpUrl ? configuredApiBaseUrl : null);

createRoot(document.getElementById("root")!).render(<App />);

