/**
 * ============================================================================
 * CÓDIGO DE TESTE — DEV CRUD
 * * Este componente foi criado exclusivamente para o grupo testar, entender
 * e validar o funcionamento das operações de CRUD (Create, Read, Update, Delete)
 * integradas com o banco de dados Supabase através do arquivo 'imoveisService'.
 * ============================================================================
 */

import { useEffect, useState } from 'react'
// Importa as funções do serviço de imóveis que fazem a ponte (requisições) com o Supabase
import {
  listarImoveis,
  criarImovel,
  atualizarImovel,
  excluirImovel
} from '../services/imoveisService'

function DevCrud() {
  // Estado local que vai armazenar a lista de imóveis trazida do Supabase
  const [imoveis, setImoveis] = useState([])

  // Hook useEffect: executa a função carregarImoveis assim que o componente é exibido na tela
  useEffect(() => {
    carregarImoveis()
  }, []) // O array vazio garante que rode apenas uma vez na inicialização

  /**
   * READ (Leitura/Consulta)
   * Busca todos os imóveis salvos no Supabase e atualiza o estado local.
   */
  async function carregarImoveis() {
    // Faz a chamada assíncrona para o serviço do Supabase
    const { data, error } = await listarImoveis()

    // Se houver algum erro (ex: tabela não existe, erro de conexão), exibe no console e interrompe
    if (error) {
      console.error(error)
      return
    }

    // Se der certo, salva os dados recebidos (data) dentro do estado 'imoveis'
    setImoveis(data)
  }

  /**
   * CREATE (Criação/Inserção)
   * Cria um novo registro de imóvel com dados fictícios para testar a inserção no banco.
   */
  async function adicionarImovelTeste() {
    // Envia o objeto com as colunas necessárias para o Supabase
    const { error } = await criarImovel({
      titulo: 'Imóvel de Teste',
      preco: 999999,
      cidade: 'Brasília',
      descricao: 'Criado pelo DevCrud',
      imagem: ''
    })

    if (error) {
      console.error(error)
      return
    }

    // Se o imóvel foi criado com sucesso, recarrega a lista para exibi-lo na tela
    carregarImoveis()
  }

  /**
   * UPDATE (Atualização)
   * Pega o primeiro imóvel da lista atual e altera os dados dele no Supabase.
   */
  async function atualizarPrimeiroImovel() {
    // Segurança: se a lista estiver vazia, não faz nada para evitar erros de código
    if (imoveis.length === 0) return

    // Captura o primeiro imóvel do array (índice 0) para extrair o ID dele
    const primeiroImovel = imoveis[0]

    // Passa o ID do imóvel alvo e os novos dados que serão atualizados na linha da tabela
    const { error } = await atualizarImovel(
      primeiroImovel.id,
      {
        titulo: 'Imóvel Atualizado',
        cidade: 'Goiânia',
        preco: 888888
      }
    )

    if (error) {
      console.error(error)
      return
    }

    // Recarrega a lista para mostrar o imóvel com os dados novos em tempo real
    carregarImoveis()
  }

  /**
   * DELETE (Exclusão)
   * Pega o último imóvel cadastrado na lista e o remove permanentemente do Supabase.
   */
  async function excluirUltimoImovel() {
    // Segurança: se não houver imóveis na tela, interrompe a função
    if (imoveis.length === 0) return

    // Localiza o último imóvel do array (útil para apagar os testes criados sem estragar dados reais)
    const ultimoImovel = imoveis[imoveis.length - 1]

    // Executa o comando de deleção passando o ID do último imóvel
    const { error } = await excluirImovel(
      ultimoImovel.id
    )

    if (error) {
      console.error(error)
      return
    }

    // Recarrega a lista para sumir com o imóvel deletado da interface gráfica
  }

  // Interface visual (JSX) do painel de testes do desenvolvedor
  return (
    <div>
      <h1>DEV CRUD</h1>

      {/* Seção de Botões de Ação para acionar os testes de banco de dados */}
      <button onClick={adicionarImovelTeste}>
        Inserir Imóvel de Teste
      </button>

      <button onClick={atualizarPrimeiroImovel}>
        Atualizar Primeiro Imóvel
      </button>

      <button onClick={excluirUltimoImovel}>
        Excluir Último Imóvel
      </button>

      {/* Renderização da Lista: faz um loop no estado 'imoveis' e exibe os dados na tela */}
      {imoveis.map((imovel) => (
        <div key={imovel.id}> {/* O React exige uma chave 'key' única para cada item renderizado em loops */}
          <h2>{imovel.titulo}</h2>
          <p>{imovel.cidade}</p>
          <p>R$ {imovel.preco}</p>
        </div>
      ))}
    </div>
  )
}

export default DevCrud