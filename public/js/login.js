import { auth, db } from "./firebase-config.js";
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

document.getElementById("show-login").addEventListener("click", () => {
    document.getElementById("login-form").style.display = "block";
    document.getElementById("register-form").style.display = "none";
});

document.getElementById("show-register").addEventListener("click", () => {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("register-form").style.display = "block";
});

document.getElementById("login-btn").addEventListener("click", async () => {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log("Usuário autenticado:", user.uid);

        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log("Dados do usuário:", userData);

            if (userData.role === "admin") {
                window.location.href = "../pages/dashbord_admin.html";
            } else {
                window.location.href = "../pages/dashboard_secundario.html";
            }
        } else {
            alert("Usuário não encontrado no Firestore.");
        }
    } catch (error) {
        console.error("Erro no login:", error);
        alert("Erro ao fazer login: " + error.message);
    }
});

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