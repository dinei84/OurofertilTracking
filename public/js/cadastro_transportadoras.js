// cadastro_transportadoras.js
import { db, doc, getDoc, setDoc, auth, collection, addDoc } from '../js/firebase-config.js';

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
                alert("Você não tem permissão para cadastrar transportadoras.");
            } else {
                console.log("Usuário é admin, pode cadastrar transportadoras.");
            }
        } else {
            console.error("Documento do usuário não foi encontrado no Firestore!");
        }
    } else {
        console.error("⚠️ Nenhum usuário autenticado!");
        alert("Você precisa estar logado para cadastrar transportadoras.");
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const transportadoraId = urlParams.get('id');

    const formElement = document.getElementById('formTransportadora');
    const salvarButton = formElement.querySelector('button[type="button"]'); // Botão "Salvar"

    if (!formElement) {
        console.error("Erro: Formulário 'formTransportadora' não encontrado.");
        return;
    }

    // Carregar dados da transportadora se estiver no modo edição
    if (transportadoraId) {
        const transportadoraRef = doc(db, 'transportadoras', transportadoraId);
        const transportadoraSnap = await getDoc(transportadoraRef);

        if (transportadoraSnap.exists()) {
            const transportadora = transportadoraSnap.data();
            document.getElementById('nome').value = transportadora.nome;
            document.getElementById('cnpj').value = transportadora.cnpj;
            document.getElementById('contato').value = transportadora.contato;
        }
    }

    // Função para salvar ou atualizar a transportadora
    const salvarTransportadora = async () => {
        const nome = document.getElementById('nome').value.trim();
        const cnpj = document.getElementById('cnpj').value.trim();
        const contato = document.getElementById('contato').value.trim();

        if (!nome || !cnpj || !contato) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        try {
            if (transportadoraId) {
                // Modo edição: Atualizar a transportadora
                await setDoc(doc(db, 'transportadoras', transportadoraId), {
                    nome,
                    cnpj,
                    contato,
                    dataCadastro: new Date(),
                    status: 'ativo'
                });
                alert("Transportadora atualizada com sucesso!");
            } else {
                // Modo cadastro: Adicionar nova transportadora
                await addDoc(collection(db, 'transportadoras'), {
                    nome,
                    cnpj,
                    contato,
                    dataCadastro: new Date(),
                    status: 'ativo'
                });
                alert("Transportadora cadastrada com sucesso!");
            }
            window.location.href = "../pages/dashboard_transportadoras.html"; // Redireciona após salvar
        } catch (error) {
            console.error("Erro ao salvar transportadora:", error);
            alert("Erro ao salvar transportadora. Verifique o console.");
        }
    };

    // Evento de clique no botão "Salvar"
    salvarButton.addEventListener('click', salvarTransportadora);

    // Evento de submit no formulário (para o botão "Cadastrar")
    formElement.addEventListener('submit', async (e) => {
        e.preventDefault();
        await salvarTransportadora();
    });
});
