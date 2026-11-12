import React, { useCallback, useEffect, useState } from 'react'
import { listarImoveis, excluirImovel } from './services/imoveisService'
import CadastroImovel from './pages/CadastroImovel'
import EditarImovel from './pages/EditarImovel'
import { isSupabaseConfigured } from './services/supabase'

function App() {
  // Estados da aplicação
  const [imoveis, setImoveis] = useState([])
  const [loading, setLoading] = useState(true)
  const [modoDados, setModoDados] = useState(isSupabaseConfigured ? 'remote' : 'local')
  const [pagina, setPagina] = useState('home') // 'home' | 'cadastro' | 'editar'
  
  // Estado para armazenar o objeto do imóvel que vamos editar
  const [imovelEmEdicao, setImovelEmEdicao] = useState(null)

  // ESTADOS NOVOS: Controle do Modal de Exclusão e Notificações na Tela
  const [imovelParaExcluir, setImovelParaExcluir] = useState(null) // Armazena o imóvel que aguarda exclusão
  const [notificacao, setNotificacao] = useState(null) // { tipo: 'sucesso' | 'erro', mensagem: '' }

  // Carrega os imóveis ao montar o componente
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
  const mostrarNotificacao = useCallback((tipo, mensagem) => {
    setNotificacao({ tipo, mensagem })
    setTimeout(() => setNotificacao(null), 4000) // Desaparece após 4 segundos
  }, [])

  // Busca os imóveis utilizando o seu Service oficial
  const carregarImoveis = useCallback(async () => {
    setLoading(true)
    const { data, error, source } = await listarImoveis()
    if (error) {
      console.error('Erro ao buscar imóveis:', error)
      mostrarNotificacao('erro', 'Erro ao carregar a lista de imóveis.')
    } else {
      setImoveis(data || [])
      setModoDados(source ?? (isSupabaseConfigured ? 'remote' : 'local'))
    }
    setLoading(false)
  }, [mostrarNotificacao])

  useEffect(() => {
    const request = window.setTimeout(carregarImoveis, 0)
    return () => window.clearTimeout(request)
  }, [carregarImoveis])

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
      <div className="container app-page">
        <header className="page-topbar">
          <button className="btn btn-secondary" onClick={() => setPagina('home')}>
            ← Voltar para a listagem
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
      <div className="container app-page">
        <header className="page-topbar">
          <button className="btn btn-secondary" onClick={() => { setPagina('home'); setImovelEmEdicao(null); }}>
            ← Voltar para a listagem
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
    <div className="container app-page">

      {/* Alerta Customizado na Tela (Aviso Não-Brutalista) */}
      {notificacao && (
        <div 
          className={`toast-notificacao toast-${notificacao.tipo}`}
          role="status"
        >
          <span>{notificacao.tipo === 'sucesso' ? '✅' : '⚠️'}</span>
          <span>{notificacao.mensagem}</span>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO CUSTOMIZADO E SEGURO */}
      {imovelParaExcluir && (
        <div className="modal-overlay" role="presentation" onClick={() => setImovelParaExcluir(null)}>
          {/* O e.stopPropagation impede que cliques dentro da caixa fechem o modal */}
          <div className="modal-box" role="dialog" aria-modal="true" aria-labelledby="delete-title" onClick={(e) => e.stopPropagation()}>
            <h3 id="delete-title">Confirmar exclusão</h3>
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

      <header className="app-header">
        <div>
          <span className="eyebrow">Painel acadêmico de imóveis</span>
          <h1>Imobiliária Control</h1>
          <p>Cadastre, consulte, edite e remova imóveis em uma interface simples.</p>
        </div>
        <button className="btn btn-primary" onClick={irParaCadastro}>
          + Cadastrar Novo Imóvel
        </button>
      </header>

      <main>
        <div className="list-toolbar">
          <div>
            <h2>Imóveis cadastrados</h2>
            <p>{imoveis.length} {imoveis.length === 1 ? 'registro encontrado' : 'registros encontrados'}</p>
          </div>
          <span className={`mode-badge ${modoDados}`}>
            {modoDados === 'remote' ? 'Supabase conectado' : 'Modo demonstração local'}
          </span>
        </div>
        {loading ? (
          <div className="loading-state" role="status">Carregando imóveis...</div>
        ) : (
          <div className="cards-grid">
            {imoveis.length === 0 ? (
              <div className="empty-state">
                <p>Nenhum imóvel encontrado. Clique em cadastrar para adicionar o primeiro!</p>
              </div>
            ) : (
              imoveis.map((imovel) => (
                <article key={imovel.id} className="card">
                  <div className="card-media">
                    {imovel.imagem ? (
                      <img src={imovel.imagem} alt="" onError={(event) => event.currentTarget.parentElement.classList.add('image-error')} />
                    ) : null}
                    <span className="card-placeholder" aria-hidden="true">⌂</span>
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">{imovel.titulo}</h3>
                    <p className="card-price">{formatarPreco(imovel.preco)}</p>
                    <p className="card-city">📍 {imovel.cidade}</p>
                    <p className="card-description">{imovel.descricao}</p>
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
                </article>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default App
