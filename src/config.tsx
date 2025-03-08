// User config
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

document.addEventListener("DOMContentLoaded", () => {
  console.log("Config loaded");
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <p>
        Wow look at all these great config options that I definitely implemented
      </p>
    </StrictMode>
  );
});
