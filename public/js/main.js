import { auth } from "./firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

document.getElementById("logout-btn").addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "login.html";
});
