// register.js

import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

// Função para cadastrar novo usuário
async function registrarUsuario(email, password, role = "secondary") {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Criar documento no Firestore com UID como ID
        await setDoc(doc(db, "users", user.uid), {
            nome: email.split("@")[0], // Nome baseado no e-mail
            email: email,
            role: role, // "admin" ou "secondary"
            permissoes: role === "admin" ? ["cadastrar_cargas", "editar_transportadoras"] : ["visualizar_retiradas"]
        });

        alert("Usuário cadastrado com sucesso!");
        window.location.href = "login.html"; // Redireciona para login
    } catch (error) {
        console.error("Erro ao registrar usuário:", error);
        alert("Erro ao cadastrar: " + error.message);
    }
}

// Event Listener do botão de cadastro
document.getElementById("register-btn").addEventListener("click", () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value; // Opção admin/secundário

    registrarUsuario(email, password, role);
});
