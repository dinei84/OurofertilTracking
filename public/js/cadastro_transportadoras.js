// Import Firebase configuration
import { db, collection, addDoc } from '../js/firebase-config.js';

const auth = getAuth();
auth.onAuthStateChanged(async (user) => {
    if (user) {
        const token = await user.getIdTokenResult();
        console.log("Usuário autenticado:", user.email);
        console.log("Claims do usuário:", token.claims);

        if (token.claims.role !== "admin") {
            console.error("⚠️ Usuário não tem permissão de admin!");
            alert("Você não tem permissão para cadastrar transportadoras.");
        }
    } else {
        console.error("⚠️ Nenhum usuário autenticado!");
        alert("Você precisa estar logado para cadastrar transportadoras.");
    }
});

// Função para cadastrar uma transportadora no Firestore
async function cadastrarTransportadora(dadosTransportadora) {
    try {
        const transportadorasRef = collection(db, 'transportadoras');

        // Adiciona o documento ao Firestore
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

// Verifica se o formulário existe antes de adicionar o event listener
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

        // Verifica se os campos não estão vazios
        if (!nomeInput.value.trim() || !cnpjInput.value.trim() || !contatoInput.value.trim()) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        const dadosTransportadora = {
            nome: nomeInput.value.trim(),
            cnpj: cnpjInput.value.trim(),
            contato: contatoInput.value.trim()
        };

        try {
            await cadastrarTransportadora(dadosTransportadora);
            alert('Transportadora cadastrada com sucesso!');
            e.target.reset();
        } catch (error) {
            alert('Erro ao cadastrar transportadora. Verifique o console.');
        }
    });
});
