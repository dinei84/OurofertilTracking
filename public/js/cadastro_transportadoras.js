// cadastro_transportadoras.js
import { db, auth, collection, addDoc } from '../js/firebase-config.js';

// Precisamos importar doc e getDoc para ler o documento do usuário
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

auth.onAuthStateChanged(async (user) => {
    if (user) {
        // Em vez de checar user.getIdTokenResult(), vamos ler o doc do user
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

// Função para cadastrar transportadora no Firestore
async function cadastrarTransportadora(dadosTransportadora) {
    try {
        const transportadorasRef = collection(db, 'transportadoras');
        const docRef = await addDoc(transportadorasRef, {
            nome: dadosTransportadora.nome,
            cnpj: dadosTransportadora.cnpj,
            contato: dadosTransportadora.contato,
            dataCadastro: new Date(),
            status: 'ativo'
        });

        console.log('Transportadora cadastrada com sucesso! ID:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('Erro ao cadastrar transportadora:', error.message);
        throw error;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const formElement = document.getElementById('formTransportadora');

    if (!formElement) {
        console.error("Erro: Formulário 'formTransportadora' não encontrado.");
        return;
    }

    formElement.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nomeInput = document.getElementById('nome');
        const cnpjInput = document.getElementById('cnpj');
        const contatoInput = document.getElementById('contato');

        if (!nomeInput || !cnpjInput || !contatoInput) {
            console.error("Erro: Campos obrigatórios não encontrados.");
            return;
        }

        if (!nomeInput.value.trim() || !cnpjInput.value.trim() || !contatoInput.value.trim()) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        try {
            await cadastrarTransportadora({
                nome: nomeInput.value.trim(),
                cnpj: cnpjInput.value.trim(),
                contato: contatoInput.value.trim()
            });
            alert('Transportadora cadastrada com sucesso!');
            e.target.reset();
        } catch (error) {
            alert('Erro ao cadastrar transportadora. Verifique o console.');
        }
    });
});