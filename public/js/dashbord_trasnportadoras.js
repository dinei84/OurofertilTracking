// dashbord_transportadoras.js
import { db, collection, getDocs, doc, deleteDoc } from '../js/firebase-config.js';

document.addEventListener("DOMContentLoaded", async () => {
    const resultSpan = document.getElementById('result');
    const searchInput = document.getElementById('search');
    const searchButton = document.querySelector('.search-container .btn');

    if (!resultSpan) {
        console.error("Erro: Elemento 'result' não encontrado.");
        return;
    }

    // Função para carregar e exibir as transportadoras
    async function carregarTransportadoras(filtro = '') {
        try {
            const transportadorasRef = collection(db, 'transportadoras');
            const querySnapshot = await getDocs(transportadorasRef);

            if (querySnapshot.empty) {
                // Estado vazio - nenhuma transportadora encontrada
                resultSpan.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">🚚</div>
                        <h3>Nenhuma transportadora encontrada</h3>
                        <p>Cadastre uma nova transportadora para começar.</p>
                        <a href="cadastro_transportadoras.html" class="btn">Cadastrar Transportadora</a>
                    </div>
                `;
                return;
            }

            let transportadorasHTML = '';
            let transportadorasFiltradas = 0;

            querySnapshot.forEach((doc) => {
                const transportadora = doc.data();
                const id = doc.id;
                
                // Aplicar filtro se existir
                if (filtro && !transportadora.nome.toLowerCase().includes(filtro.toLowerCase()) && 
                    !transportadora.cnpj.includes(filtro)) {
                    return;
                }
                
                transportadorasFiltradas++;
                
                // Gerar card para cada transportadora
                transportadorasHTML += `
                    <div class="transportadora-card card">
                        <div class="transportadora-info">
                            <div class="transportadora-details">
                                <h3>${transportadora.nome}</h3>
                                <p><strong>CNPJ:</strong> ${transportadora.cnpj}</p>
                                <p><strong>Contato:</strong> ${transportadora.contato}</p>
                                ${transportadora.status ? `<p><strong>Status:</strong> <span class="badge">${transportadora.status}</span></p>` : ''}
                            </div>
                            <div class="transportadora-stats">
                                <div>
                                    <span class="stats-label">Cargas Ativas:</span>
                                    <span class="stats-value">${transportadora.cargasAtivas || 0}</span>
                                </div>
                                <div>
                                    <span class="stats-label">Entregas Realizadas:</span>
                                    <span class="stats-value">${transportadora.entregasRealizadas || 0}</span>
                                </div>
                                ${transportadora.avaliacao ? `
                                <div>
                                    <span class="stats-label">Avaliação:</span>
                                    <span class="stats-value">${transportadora.avaliacao}/5</span>
                                </div>` : ''}
                            </div>
                        </div>
                        <div class="transportadora-actions">
                            <button class="btn" onclick="editarTransportadora('${id}')">Editar</button>
                            <button class="btn btn-secondary" onclick="deletarTransportadora('${id}')">Excluir</button>
                        </div>
                    </div>
                `;
            });

            if (transportadorasFiltradas === 0 && filtro) {
                resultSpan.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">🔍</div>
                        <h3>Nenhuma transportadora encontrada</h3>
                        <p>Não encontramos transportadoras com o termo "${filtro}".</p>
                        <button class="btn" onclick="limparFiltro()">Limpar Filtro</button>
                    </div>
                `;
            } else {
                resultSpan.innerHTML = transportadorasHTML;
            }
        } catch (error) {
            console.error("Erro ao carregar transportadoras:", error);
            resultSpan.innerHTML = `
                <div class="alert alert-error">
                    <p>Erro ao carregar transportadoras. Por favor, tente novamente.</p>
                </div>
            `;
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
                
                // Mostrar mensagem de sucesso
                const alertElement = document.createElement('div');
                alertElement.className = 'alert alert-success';
                alertElement.innerHTML = '<p>Transportadora deletada com sucesso!</p>';
                
                // Inserir alerta antes do resultado
                resultSpan.parentNode.insertBefore(alertElement, resultSpan);
                
                // Remover alerta após 3 segundos
                setTimeout(() => {
                    alertElement.remove();
                }, 3000);
                
                // Recarregar a lista
                carregarTransportadoras(searchInput.value);
            } catch (error) {
                console.error("Erro ao deletar transportadora:", error);
                
                const alertElement = document.createElement('div');
                alertElement.className = 'alert alert-error';
                alertElement.innerHTML = '<p>Erro ao deletar transportadora. Por favor, tente novamente.</p>';
                
                resultSpan.parentNode.insertBefore(alertElement, resultSpan);
                
                setTimeout(() => {
                    alertElement.remove();
                }, 3000);
            }
        }
    };
    
    // Função para limpar filtro
    window.limparFiltro = () => {
        searchInput.value = '';
        carregarTransportadoras();
    };
    
    // Adicionar evento de busca
    if (searchButton) {
        searchButton.addEventListener('click', () => {
            carregarTransportadoras(searchInput.value);
        });
    }
    
    // Adicionar evento de busca ao pressionar Enter
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                carregarTransportadoras(searchInput.value);
            }
        });
    }

    // Carregar as transportadoras ao abrir a página
    await carregarTransportadoras();
});