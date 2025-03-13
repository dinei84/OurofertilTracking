import { auth, db } from "../js/firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (userDoc.exists()) {
            const userData = userDoc.data();
            
            // Verifica se é admin
            if (userData.role === "admin") {
                window.location.href = "pages/dashboard_admin.html";
            } else {
                alert("Acesso restrito a administradores!");
                await auth.signOut(); // Força logout
            }
        } else {
            alert("Usuário não encontrado!");
        }
    } catch (error) {
        console.error("Erro no login:", error);
        alert("Erro: " + error.message);
    }
});