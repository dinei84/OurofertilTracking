// register.js
import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

document.getElementById("register-btn").addEventListener("click", async () => {
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    const role = document.getElementById("register-role").value;

    if (password.length < 6) {
        alert("A senha deve ter pelo menos 6 caracteres.");
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log("Usuário cadastrado com sucesso:", user.uid);

        // Salva o usuário com a role selecionada
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            nome: email.split("@")[0],
            email: email,
            role: role,
            permissoes: role === "admin" ? ["cadastrar_cargas", "editar_transportadoras"] : ["visualizar_retiradas"]
        });

        alert("Cadastro realizado com sucesso!");
        window.location.href = "login.html";
    } catch (error) {
        console.error("Erro no cadastro:", error.code, error.message);
        alert("Erro ao cadastrar: " + error.message);
    }
});