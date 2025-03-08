// dashbord_transportadoras.js
import { db, collection, getDocs, doc, deleteDoc } from '../js/firebase-config.js';

document.addEventListener("DOMContentLoaded", async () => {
    const resultSpan = document.getElementById('result');

    if (!resultSpan) {
        console.error("Erro: Elemento 'result' não encontrado.");
        return;
    }

    // Função para carregar e exibir as transportadoras
    async function carregarTransportadoras() {
        try {
            const transportadorasRef = collection(db, 'transportadoras');
            const querySnapshot = await getDocs(transportadorasRef);

            if (querySnapshot.empty) {
                resultSpan.innerHTML = "<p>Nenhuma transportadora cadastrada.</p>";
                return;
            }

            // Criar a tabela dinâmica
            let tabelaHTML = `
                <table border="1" cellpadding="10" cellspacing="0">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>CNPJ</th>
                            <th>Contato</th>
                            
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            querySnapshot.forEach((doc) => {
                const transportadora = doc.data();
                tabelaHTML += `
                    <tr>
                        <td>${transportadora.nome}</td>
                        <td>${transportadora.cnpj}</td>
                        <td>${transportadora.contato}</td>
                        
                        <td>${transportadora.status}</td>
                        <td>
                            <button onclick="editarTransportadora('${doc.id}')">Editar</button>
                            <button onclick="deletarTransportadora('${doc.id}')">Deletar</button>
                        </td>
                    </tr>
                `;
            });

            tabelaHTML += `</tbody></table>`;
            resultSpan.innerHTML = tabelaHTML;
        } catch (error) {
            console.error("Erro ao carregar transportadoras:", error);
            resultSpan.innerHTML = "<p>Erro ao carregar transportadoras. Verifique o console.</p>";
        }
    }

    // Função para editar transportadora
    window.editarTransportadora = async (id) => {
        // Redireciona para a página de cadastro com o ID da transportadora
        window.location.href = `cadastro_transportadoras.html?id=${id}`;
    };

    // Função para deletar transportadora
    window.deletarTransportadora = async (id) => {
        if (confirm("Tem certeza que deseja deletar esta transportadora?")) {
            try {
                await deleteDoc(doc(db, 'transportadoras', id));
                alert("Transportadora deletada com sucesso!");
                carregarTransportadoras(); // Recarrega a tabela após deletar
            } catch (error) {
                console.error("Erro ao deletar transportadora:", error);
                alert("Erro ao deletar transportadora. Verifique o console.");
            }
        }
    };

    // Carregar as transportadoras ao abrir a página
    await carregarTransportadoras();
});