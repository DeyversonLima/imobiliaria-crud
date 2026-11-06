/**
 * ============================================================================
 * SERVIÇO OFICIAL — IMÓVEIS (imoveisService.js)
 * * Este arquivo centraliza todas as requisições diretas ao banco de dados Supabase.
 * Ele serve como uma API local (Camada de Serviço) que o front-end chama
 * para realizar operações na tabela 'imoveis'.
 * ============================================================================
 */

// Importa o cliente configurado do Supabase (que possui as chaves de acesso ao projeto)
import { supabase } from './supabase'

const STORAGE_KEY = 'imobiliaria-control:imoveis'
const DEMO_IMOVEIS = [
  {
    id: 'demo-1',
    titulo: 'Apartamento com varanda',
    preco: 485000,
    cidade: 'Brasília, DF',
    descricao: 'Imóvel demonstrativo com dois quartos e varanda integrada.',
    imagem: null
  },
  {
    id: 'demo-2',
    titulo: 'Casa próxima ao parque',
    preco: 720000,
    cidade: 'Águas Claras, DF',
    descricao: 'Registro de exemplo usado no modo local da aplicação.',
    imagem: null
  }
]

function readLocalImoveis() {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_IMOVEIS))
    return DEMO_IMOVEIS
  }

  try {
    return JSON.parse(stored)
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_IMOVEIS))
    return DEMO_IMOVEIS
  }
}

function writeLocalImoveis(imoveis) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(imoveis))
}

/**
 * READ (Leitura) — Busca todos os registros.
 * Equivale ao comando SQL: SELECT * FROM imoveis;
 * * @returns {Promise} Retorna um objeto contendo { data, error }.
 * 'data' é um array com todos os imóveis encontrados, e 'error' traz falhas se houver.
 */
export async function listarImoveis() {
  if (supabase) {
    return supabase.from('imoveis').select('*')
  }
  return { data: readLocalImoveis(), error: null }
}

/**
 * CREATE (Criação) — Insere um novo registro na tabela.
 * Equivale ao comando SQL: INSERT INTO imoveis (colunas) VALUES (valores);
 * * @param {Object} imovel — Objeto contendo os campos do imóvel (titulo, preco, cidade, etc).
 * @returns {Promise} Retorna { error } para sabermos se a inserção falhou ou deu certo.
 */
export async function criarImovel(imovel) {
  if (supabase) {
    return supabase.from('imoveis').insert([imovel])
  }
  const imoveis = readLocalImoveis()
  const novoImovel = { ...imovel, id: crypto.randomUUID() }
  writeLocalImoveis([novoImovel, ...imoveis])
  return { data: [novoImovel], error: null }
}

/**
 * UPDATE (Atualização) — Altera dados de um registro existente baseado no ID.
 * Equivale ao comando SQL: UPDATE imoveis SET colunas = valores WHERE id = id_informado;
 * * @param {string|number} id — O identificador único do imóvel que queremos alterar.
 * @param {Object} dados — Objeto contendo apenas os campos e novos valores que queremos modificar.
 * @returns {Promise} Retorna { error } para checagem de sucesso.
 */
export async function atualizarImovel(id, dados) {
  if (supabase) {
    return supabase.from('imoveis').update(dados).eq('id', id)
  }
  const imoveis = readLocalImoveis()
  writeLocalImoveis(imoveis.map((imovel) => (
    imovel.id === id ? { ...imovel, ...dados } : imovel
  )))
  return { error: null }
}

/**
 * DELETE (Exclusão) — Remove permanentemente um registro do banco pelo ID.
 * Equivale ao comando SQL: DELETE FROM imoveis WHERE id = id_informado;
 * * @param {string|number} id — O identificador único do imóvel que será excluído.
 * @returns {Promise} Retorna { error } para validação.
 */
export async function excluirImovel(id) {
  if (supabase) {
    return supabase.from('imoveis').delete().eq('id', id)
  }
  writeLocalImoveis(readLocalImoveis().filter((imovel) => imovel.id !== id))
  return { error: null }
}
