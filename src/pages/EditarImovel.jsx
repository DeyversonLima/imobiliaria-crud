import { useState } from 'react'
import { atualizarImovel } from '../services/imoveisService'

function criarFormData(imovel) {
  return {
    titulo: imovel?.titulo || '',
    preco: imovel?.preco ? String(Number(imovel.preco) * 100) : '',
    cidade: imovel?.cidade || '',
    descricao: imovel?.descricao || '',
    imagem: imovel?.imagem || ''
  }
}

function EditarImovel({ imovel, onEdicaoSucesso, onCancelar }) {
  // Estado isolado para o formulário de edição (incluindo descricao e imagem)
  const [formData, setFormData] = useState(() => criarFormData(imovel))
  
  const [carregando, setCarregando] = useState(false)
  
  // Estado para controlar a exibição dos alertas customizados e elegantes na tela
  const [notificacao, setNotificacao] = useState(null) // { tipo: 'sucesso' | 'erro', mensagem: '' }

  // Função para exibir o alerta customizado na tela
  const mostrarNotificacao = (tipo, mensagem) => {
    setNotificacao({ tipo, mensagem })
    if (tipo === 'erro') {
      setTimeout(() => setNotificacao(null), 4000)
    }
  }

  // Auxiliar: Transforma centavos/números brutos no formato visual R$ 0,00
  const formatarParaInputBRL = (valor) => {
    if (!valor) return '0,00'
    const valorNum = Number(valor) / 100
    return valorNum.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  // Monitora as mudanças nos inputs e aplica a máscara de moeda
  const handleChange = (e) => {
    const { name, value } = e.target
    
    if (name === 'preco') {
      // Deixa apenas números digitados pelo usuário
      const apenasNumeros = value.replace(/\D/g, '')
      setFormData({
        ...formData,
        preco: apenasNumeros
      })
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }

  // Envia os dados atualizados para o Supabase
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validações básicas de preenchimento obrigatório
    if (!formData.titulo.trim() || !formData.preco || !formData.cidade.trim() || !formData.descricao.trim()) {
      mostrarNotificacao('erro', 'Por favor, preencha todos os campos obrigatórios antes de atualizar.')
      return
    }

    // Validação específica do tamanho do título
    if (formData.titulo.trim().length < 5) {
      mostrarNotificacao('erro', 'O título deve ter pelo menos 5 caracteres.')
      return
    }

    // Validação específica do tamanho da cidade
    if (formData.cidade.trim().length < 3) {
      mostrarNotificacao('erro', 'Informe uma cidade válida (mínimo 3 caracteres).')
      return
    }

    // Validação específica da descrição herdada do seu CadastroImovel
    if (formData.descricao.trim().length < 10) {
      mostrarNotificacao('erro', 'A descrição deve ter pelo menos 10 caracteres.')
      return
    }

    // Nova validação da URL da Imagem (se preenchida, valida o formato http/https)
    if (formData.imagem && !/^https?:\/\/.+\..+/.test(formData.imagem.trim())) {
      mostrarNotificacao('erro', 'Informe uma URL de imagem válida (http/https).')
      return
    }

    setCarregando(true)

    // Prepara o objeto convertendo o preço de volta para float e limpando os espaços do texto
    const dadosParaEnviar = {
      titulo: formData.titulo.trim(),
      preco: Number(formData.preco) / 100,
      cidade: formData.cidade.trim(),
      descricao: formData.descricao.trim(),
      imagem: formData.imagem.trim()
    }

    // Executa a função do seu imoveisService.js
    const { error } = await atualizarImovel(imovel.id, dadosParaEnviar)

    if (error) {
      mostrarNotificacao('erro', 'Erro ao atualizar o imóvel: ' + error.message)
      setCarregando(false)
    } else {
      mostrarNotificacao('sucesso', 'Imóvel atualizado com sucesso! 🎉')
      
      // Aguarda 2 segundos exibindo o aviso de sucesso na tela antes de redirecionar para a home
      setTimeout(() => {
        onEdicaoSucesso()
      }, 2000)
    }
  }

  return (
    <section className="form-container">
      {notificacao && (
        <div className={`toast-notificacao toast-${notificacao.tipo}`} role="status">
          <span>{notificacao.tipo === 'sucesso' ? '✅' : '⚠️'}</span>
          <span>{notificacao.mensagem}</span>
        </div>
      )}

      <header className="form-header">
        <span className="eyebrow">Alterar registro</span>
        <h1>Editar imóvel</h1>
        <p>Revise os dados de <strong>{imovel?.titulo}</strong> e salve as alterações.</p>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="campo-grupo">
            <label htmlFor="titulo">Título do Imóvel</label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              placeholder="Ex: Apartamento Vista Mar"
            />
          </div>
          
          <div className="campo-grupo">
            <label htmlFor="preco">Preço</label>
            <div className="input-prefix"><span>R$</span><input
              type="text"
              id="preco"
              name="preco"
              value={formatarParaInputBRL(formData.preco)}
              onChange={handleChange}
              placeholder="0,00"
            /></div>
          </div>

          <div className="campo-grupo">
            <label htmlFor="cidade">Cidade</label>
            <input
              type="text"
              id="cidade"
              name="cidade"
              value={formData.cidade}
              onChange={handleChange}
              placeholder="Ex: Florianópolis"
            />
          </div>

          {/* Novo Campo Adicionado: URL da Imagem */}
          <div className="campo-grupo">
            <label htmlFor="imagem">URL da Imagem (Opcional)</label>
            <input
              type="text"
              id="imagem"
              name="imagem"
              value={formData.imagem}
              onChange={handleChange}
              placeholder="Ex: https://site.com/imagem.jpg"
            />
          </div>
        </div>

        {/* Campo: Descrição */}
        <div className="campo-grupo campo-largo">
          <label htmlFor="descricao">Descrição do Imóvel</label>
          <textarea
            id="descricao"
            name="descricao"
            rows="4"
            value={formData.descricao}
            onChange={handleChange}
            placeholder="Digite uma descrição detalhada do imóvel (mínimo de 10 caracteres)..."
          />
          <span className="contador">{formData.descricao.length}/500</span>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onCancelar}
            disabled={carregando}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={carregando}
          >
            {carregando ? 'Atualizando...' : 'Atualizar Imóvel'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default EditarImovel
