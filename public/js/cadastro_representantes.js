import { db, doc, getDoc, auth, setDoc, collection, addDoc } from './firebase-config.js';

// Verifica se o usuário está autenticado e tem permissão de admin
auth.onAuthStateChanged(async (user) => {
    if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            console.log("Usuário autenticado:", user.email);
            console.log("Dados do usuário:", userData);

            if (userData.role !== "admin") {
                console.error("⚠️ Usuário não tem permissão de admin!");
                alert("Você não tem permissão para cadastrar representantes.");
            } else {
                console.log("Usuário é admin, pode cadastrar representantes.");
            }
        } else {
            console.error("Documento do usuário não foi encontrado no Firestore!");
        }
    } else {
        console.error("⚠️ Nenhum usuário autenticado!");
        alert("Você precisa estar logado para cadastrar representantes.");
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const representanteId = urlParams.get('id');
    const formElement = document.getElementById('formRepresentante');
    const salvarButton = document.getElementById('save'); // Botão "Salvar"

    if (!formElement) {
        console.error("Erro: Formulário 'formRepresentante' não encontrado.");
        return;
    }

    // Carregar dados do representante se estiver no modo edição
    if (representanteId) {
        const representanteRef = doc(db, 'representantes', representanteId);
        const representanteSnap = await getDoc(representanteRef);

        if (representanteSnap.exists()) {
            const representante = representanteSnap.data();
            document.getElementById('nome').value = representante.nome;
            document.getElementById('contato').value = representante.contato;
        }
    }

    // Função para salvar ou atualizar o representante
    const salvarRepresentante = async () => {
        const nome = document.getElementById('nome').value.trim();
        const contato = document.getElementById('contato').value.trim();

        if (!nome || !contato) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        try {
            if (representanteId) {
                // Modo edição: Atualizar o representante
                await setDoc(doc(db, 'representantes', representanteId), {
                    nome,
                    contato,
                });
                alert("Representante atualizado com sucesso!");
            } else {
                // Modo cadastro: Adicionar um novo representante
                await addDoc(collection(db, 'representantes'), {
                    nome,
                    contato,
                });
                alert("Representante cadastrado com sucesso!");
                formElement.reset(); // Limpar o formulário
            }
            window.location.href = "../pages/dashboard_representantes.html"; // Redirecionar para a lista de representantes
        } catch (error) {
            console.error("Erro ao salvar representante:", error);
            alert("Erro ao salvar representante. Tente novamente mais tarde.");
        }
    };

    // Evento de clique no botão "Salvar"
    salvarButton.addEventListener('click', salvarRepresentante);

    // Evento de submit no formulário (para o botão "Cadastrar")
    formElement.addEventListener('submit', async (e) => {
        e.preventDefault();
        await salvarRepresentante();
    });
});