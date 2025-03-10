// dashbord_representantes.js
import {db, collection, getDocs, doc, deleteDoc} from './firebase-config.js';

document.addEventListener('DOMContentLoaded', async () => {
    const resultSpan = document.getElementById('result');
    const searchInput = document.getElementById('search');
    const searchButton = document.getElementById('searchButton');

    if (!resultSpan) {
        console.error("Erro: Elemento 'result' não encontrado.");
        return;
    }

    // Função para carregar e exibir os representantes
    async function carregarRepresentantes(filtro = '') {
        try {
            const representantesRef = collection(db, 'representantes');
            const querySnapshot = await getDocs(representantesRef);

            if (querySnapshot.empty) {
                // Estado vazio - nenhum representante encontrado
                resultSpan.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M19,19H5V5H19M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M16.5,16.25C16.5,14.75 13.5,14 12,14C10.5,14 7.5,14.75 7.5,16.25V17H16.5M12,12.25A2.25,2.25 0 0,0 14.25,10A2.25,2.25 0 0,0 12,7.75A2.25,2.25 0 0,0 9.75,10A2.25,2.25 0 0,0 12,12.25Z" />
                            </svg>
                        </div>
                        <h3>Nenhum representante encontrado</h3>
                        <p>Cadastre um novo representante para começar.</p>
                        <a href="cadastro_representantes.html" class="btn">Cadastrar Representante</a>
                    </div>
                `;
                return;
            }

            let representantesHTML = '';
            let representantesFiltrados = 0;

            querySnapshot.forEach((doc) => {
                const representante = doc.data();
                const id = doc.id;
                
                // Aplicar filtro se existir
                if (filtro && !representante.nome.toLowerCase().includes(filtro.toLowerCase())) {
                    return;
                }
                
                representantesFiltrados++;
                
                // Gerar card para cada representante
                representantesHTML += `
                    <div class="representante-card card">
                        <div class="representante-info">
                            <div class="representante-details">
                                <h3>${representante.nome}</h3>
                                ${representante.cpf ? `<p><strong>CPF:</strong> ${representante.cpf}</p>` : ''}
                                <p><strong>Contato:</strong> ${representante.contato}</p>
                                ${representante.status ? `<p><strong>Status:</strong> <span class="badge">${representante.status}</span></p>` : ''}
                            </div>
                            <div class="representante-stats">
                                <div>
                                    <span class="stats-label">Cargas Ativas:</span>
                                    <span class="stats-value">${representante.cargasAtivas || 0}</span>
                                </div>
                                <div>
                                    <span class="stats-label">Cargas Completadas:</span>
                                    <span class="stats-value">${representante.cargasCompletadas || 0}</span>
                                </div>
                            </div>
                        </div>
                        <div class="representante-actions">
                            <button class="btn" onclick="editarRepresentante('${id}')">Editar</button>
                            <button class="btn btn-secondary" onclick="deletarRepresentante('${id}')">Excluir</button>
                        </div>
                    </div>
                `;
            });

            if (representantesFiltrados === 0 && filtro) {
                resultSpan.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">🔍</div>
                        <h3>Nenhum representante encontrado</h3>
                        <p>Não encontramos representantes com o termo "${filtro}".</p>
                        <button class="btn" onclick="limparFiltro()">Limpar Filtro</button>
                    </div>
                `;
            } else {
                resultSpan.innerHTML = representantesHTML;
            }
        } catch (error) {
            console.error("Erro ao carregar representantes: ", error);
            resultSpan.innerHTML = `
                <div class="error-state">
                    <div class="error-state-icon">⚠️</div>
                    <h3>Erro ao carregar representantes</h3>
                    <p>Recarregue a página para tentar novamente.</p>
                </div>
            `;
        }   
    }

    // Função para Editar Representante
    window.editarRepresentante = (id) => {
        window.location.href = `cadastro_representantes.html?id=${id}`;
    }

    // Função para Excluir Representante
    window.deletarRepresentante = async (id) => {
        if (confirm("Tem certeza que deseja excluir este representante?")) {
            try {
                await deleteDoc(doc(db, 'representantes', id));
                
                // Mostrar mensagem de sucesso
                const alertElement = document.createElement('div');
                alertElement.className = 'alert alert-success';
                alertElement.innerHTML = '<p>Representante excluído com sucesso!</p>';
                
                // Inserir alerta antes do resultado
                resultSpan.parentNode.insertBefore(alertElement, resultSpan);
                
                // Remover alerta após 3 segundos
                setTimeout(() => {
                    alertElement.remove();
                }, 3000);
                
                // Recarregar a lista
                carregarRepresentantes(searchInput.value);
            } catch (error) {
                console.error("Erro ao excluir representante: ", error);
                
                const alertElement = document.createElement('div');
                alertElement.className = 'alert alert-error';
                alertElement.innerHTML = '<p>Erro ao excluir representante. Por favor, tente novamente.</p>';
                
                resultSpan.parentNode.insertBefore(alertElement, resultSpan);
                
                setTimeout(() => {
                    alertElement.remove();
                }, 3000);
            }
        }
    }

    // Função para limpar filtro
    window.limparFiltro = () => {
        searchInput.value = '';
        carregarRepresentantes();
    }

    // Adicionar evento de busca
    if (searchButton) {
        searchButton.addEventListener('click', () => {
            carregarRepresentantes(searchInput.value);
        });
    }   

    // Adiciona evento de busca ao pressionar Enter
    if (searchInput) {
        searchInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                carregarRepresentantes(searchInput.value);
            }
        });
    }

    // Carregar os representantes ao abrir a página
    await carregarRepresentantes();
});