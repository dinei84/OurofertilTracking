import { auth, db } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

document.getElementById("login-btn").addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Buscar informações do usuário no Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.role === "admin") {
                window.location.href = "dashboard_admin.html";
            } else if (userData.role === "secondary") {
                window.location.href = "dashboard_secundario.html";
            }
        } else {
            alert("Usuário sem permissão");
        }
    } catch (error) {
        alert("Erro ao fazer login: " + error.message);
    }
});
