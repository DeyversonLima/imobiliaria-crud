import { useEffect, useState } from 'react'
import { listarImoveis, excluirImovel } from './services/imoveisService'
import CadastroImovel from './pages/CadastroImovel'
import EditarImovel from './pages/EditarImovel'

function App() {
  // Estados da aplicação
  const [imoveis, setImoveis] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagina, setPagina] = useState('home') // 'home' | 'cadastro' | 'editar'
  
  // Estado para armazenar o objeto do imóvel que vamos editar
  const [imovelEmEdicao, setImovelEmEdicao] = useState(null)

  // ESTADOS NOVOS: Controle do Modal de Exclusão e Notificações na Tela
  const [imovelParaExcluir, setImovelParaExcluir] = useState(null) // Armazena o imóvel que aguarda exclusão
  const [notificacao, setNotificacao] = useState(null) // { tipo: 'sucesso' | 'erro', mensagem: '' }

  // Carrega os imóveis ao montar o componente
  useEffect(() => {
    carregarImoveis()
  }, [])

  // Ouvinte de teclado para controlar com segurança o Modal de Exclusão
  useEffect(() => {
    const gerenciarTeclado = (e) => {
      if (!imovelParaExcluir) return

      if (e.key === 'Escape') {
        setImovelParaExcluir(null) // Fecha o modal com segurança
      }
      
      if (e.key === 'Enter') {
        e.preventDefault() // Bloqueia totalmente a ação do Enter por segurança
      }
    }

    window.addEventListener('keydown', gerenciarTeclado)
    return () => window.removeEventListener('keydown', gerenciarTeclado)
  }, [imovelParaExcluir])

  // Gerenciador de Avisos Flutuantes (Toasts)
  const mostrarNotificacao = (tipo, mensagem) => {
    setNotificacao({ tipo, mensagem })
    setTimeout(() => setNotificacao(null), 4000) // Desaparece após 4 segundos
  }

  // Busca os imóveis utilizando o seu Service oficial
  async function carregarImoveis() {
    setLoading(true)
    const { data, error } = await listarImoveis()
    if (error) {
      console.error('Erro ao buscar imóveis:', error)
      mostrarNotificacao('erro', 'Erro ao carregar a lista de imóveis.')
    } else {
      setImoveis(data || [])
    }
    setLoading(false)
  }

  // Abre o modal customizado definindo o imóvel alvo
  function iniciarExclusao(imovel) {
    setImovelParaExcluir(imovel)
  }

  // Executa de fato a remoção no Supabase ao clicar no botão do Modal
  async function confirmarExclusao() {
    if (!imovelParaExcluir) return

    const { error } = await excluirImovel(imovelParaExcluir.id)
    
    if (error) {
      mostrarNotificacao('erro', 'Erro ao excluir o imóvel: ' + error.message)
    } else {
      mostrarNotificacao('sucesso', 'Imóvel removido com sucesso! 🗑️')
      carregarImoveis() // Atualiza os cards
    }

    setImovelParaExcluir(null) // Fecha o modal
  }

  // Redireciona para a página dedicada de edição enviando os dados correspondentes
  function iniciarEdicao(imovel) {
    setImovelEmEdicao(imovel)
    setPagina('editar')
  }

  // Modifica a navegação para garantir que o formulário de cadastro inicie limpo
  function irParaCadastro() {
    setImovelEmEdicao(null)
    setPagina('cadastro')
  }

  // Formatação simples de moeda (BRL) para o card
  const formatarPreco = (valor) => {
    return Number(valor).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  /* ==========================================
     TELA DE CADASTRO 
     ========================================== */
  if (pagina === 'cadastro') {
    return (
      <div className="container">
        <header style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
          <button className="btn btn-secondary" onClick={() => setPagina('home')}>
            ← Voltar para a Home
          </button>
        </header>
        
        <CadastroImovel
          onCadastroSucesso={() => {
            carregarImoveis()
            setPagina('home')
          }}
        />
      </div>
    )
  }

  /* ==========================================
     TELA DEDICADA DE EDIÇÃO 
     ========================================== */
  if (pagina === 'editar') {
    return (
      <div className="container">
        <header style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
          <button className="btn btn-secondary" onClick={() => { setPagina('home'); setImovelEmEdicao(null); }}>
            ← Cancelar e Voltar
          </button>
        </header>

        <EditarImovel
          imovel={imovelEmEdicao}
          onEdicaoSucesso={() => {
            carregarImoveis()
            setPagina('home')
            setImovelEmEdicao(null)
          }}
          onCancelar={() => {
            setPagina('home')
            setImovelEmEdicao(null)
          }}
        />
      </div>
    )
  }

  /* ==========================================
     TELA PRINCIPAL (HOME) - LISTAGEM EM CARDS
     ========================================== */
  return (
    <div className="container" style={{ position: 'relative' }}>
      
      {/* Injeção de Estilos CSS Locais para os componentes dinâmicos */}
      <style>{`
        /* Animações e Estilos do Toast */
        @keyframes slideInToast {
          from { transform: translate(-50%, -20px); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
        .toast-notificacao {
          position: fixed; top: 24px; left: 50%; transform: translateX(-50%);
          color: white; padding: 1rem 2rem; border-radius: 8px; z-index: 10000;
          display: flex; alignItems: center; gap: 0.75rem; font-size: 0.95rem; font-weight: 500;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
          animation: slideInToast 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Estilos do Modal de Exclusão Seguro */
        @keyframes fadeInOverlay { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleUpModal { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        
        .modal-overlay {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center; z-index: 9999;
          animation: fadeInOverlay 0.2s ease-out forwards;
        }
        .modal-box {
          background: var(--card-bg, #ffffff); padding: 2rem; border-radius: 12px;
          max-width: 450px; width: 90%; border: 1px solid var(--border, #e2e8f0);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          animation: scaleUpModal 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .modal-box h3 { font-size: 1.3rem; color: var(--text-main, #1e293b); margin-bottom: 0.5rem; }
        .modal-box p { font-size: 0.95rem; color: var(--text-muted, #64748b); line-height: 1.5; margin-bottom: 1.5rem; }
      `}</style>

      {/* Alerta Customizado na Tela (Aviso Não-Brutalista) */}
      {notificacao && (
        <div 
          className="toast-notificacao" 
          style={{ backgroundColor: notificacao.tipo === 'sucesso' ? '#16a34a' : '#dc2626' }}
        >
          <span>{notificacao.tipo === 'sucesso' ? '✅' : '⚠️'}</span>
          <span>{notificacao.mensagem}</span>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO CUSTOMIZADO E SEGURO */}
      {imovelParaExcluir && (
        <div className="modal-overlay" onClick={() => setImovelParaExcluir(null)}>
          {/* O e.stopPropagation impede que cliques dentro da caixa fechem o modal */}
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Confirmar Exclusão</h3>
            <p>
              Você tem certeza que deseja excluir permanentemente o imóvel 
              <strong> {imovelParaExcluir.titulo}</strong>?<br/>
              Esta ação não poderá ser desfeita.
            </p>
            <div className="form-actions">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setImovelParaExcluir(null)}
              >
                Cancelar
              </button>
              <button 
                type="button" 
                className="btn btn-danger" 
                onClick={confirmarExclusao}
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>Imobiliária Control</h1>
          <p>Gerencie seus imóveis de forma simples e rápida.</p>
        </div>
        <button className="btn btn-primary" onClick={irParaCadastro}>
          + Cadastrar Novo Imóvel
        </button>
      </header>

      <hr style={{ margin: '2rem 0', borderColor: '#e2e8f0' }} />

      <main>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#64748b' }}>Buscando imóveis no Supabase...</p>
        ) : (
          <div className="cards-grid">
            {imoveis.length === 0 ? (
              <div className="empty-state">
                <p>Nenhum imóvel encontrado. Clique em cadastrar para adicionar o primeiro!</p>
              </div>
            ) : (
              imoveis.map((imovel) => (
                <div key={imovel.id} className="card">
                  <div className="card-content">
                    <h3 className="card-title">{imovel.titulo}</h3>
                    <p className="card-price">{formatarPreco(imovel.preco)}</p>
                    <p className="card-city">📍 {imovel.cidade}</p>
                  </div>
                  
                  <div className="card-actions">
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => iniciarEdicao(imovel)}
                    >
                      Editar
                    </button>
                    <button 
                      className="btn btn-danger" 
                      onClick={() => iniciarExclusao(imovel)} // Alvo alterado para chamar o modal
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default App