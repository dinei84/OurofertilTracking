// login.js
import { auth, db } from "../js/firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

// Vincula o evento ao envio do formulário
document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault(); // Impede o comportamento padrão de recarregar a página

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        // Faz o login com email e senha
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log("Usuário autenticado:", user.uid);

        // Busca os dados do usuário no Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log("Dados do usuário:", userData);

            // Redireciona com base no role
            if (userData.role === "admin") {
                window.location.href = "pages/dashboard_admin.html";
            } else if (userData.role === "primary") {
                window.location.href = "pages/dashboard_primario.html"; 
            } else if (userData.role === "secondary") {
                window.location.href = "pages/dashboard_secundario.html";
            } else {
                alert("Função de usuário não reconhecida.");
            }
        } else {
            alert("Usuário não encontrado no Firestore.");
        }
    } catch (error) {
        console.error("Erro no login:", error);
        alert("Erro ao fazer login: " + error.message);
    }
});