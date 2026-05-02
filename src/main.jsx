import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.jsx"
import GiftPage from "./GiftPage.jsx"

const isGiftPage = window.location.pathname === "/gift"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {isGiftPage ? <GiftPage /> : <App />}
  </StrictMode>
)