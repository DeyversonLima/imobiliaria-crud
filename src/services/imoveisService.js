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
const DEMO_VERSION_KEY = 'imobiliaria-control:demo-version'
const DEMO_VERSION = '2'
const DEMO_IMOVEIS = [
  {
    id: 'demo-1',
    titulo: 'Apartamento com varanda no Sudoeste',
    preco: 485000,
    cidade: 'Brasília, DF',
    descricao: 'Apartamento de 74 m² com dois quartos, uma suíte, varanda integrada à sala, cozinha planejada e uma vaga coberta. Condomínio com salão de festas e portaria 24 horas.',
    imagem: null
  },
  {
    id: 'demo-2',
    titulo: 'Casa familiar próxima ao parque',
    preco: 720000,
    cidade: 'Águas Claras, DF',
    descricao: 'Casa de 180 m² em rua tranquila, com três quartos, escritório, quintal, área gourmet e garagem para dois carros. Fica a poucos minutos do parque e do comércio local.',
    imagem: null
  },
  {
    id: 'demo-3',
    titulo: 'Cobertura duplex com terraço',
    preco: 1290000,
    cidade: 'Goiânia, GO',
    descricao: 'Cobertura duplex de 210 m² com quatro quartos, piscina privativa, terraço com churrasqueira, sala de TV e três vagas. Vista aberta e acabamento contemporâneo.',
    imagem: null
  },
  {
    id: 'demo-4',
    titulo: 'Studio mobiliado perto da universidade',
    preco: 265000,
    cidade: 'Brasília, DF',
    descricao: 'Studio de 32 m² entregue mobiliado, com cozinha compacta, espaço de trabalho e ar-condicionado. Ideal para estudantes, próximo a transporte e serviços.',
    imagem: null
  },
  {
    id: 'demo-5',
    titulo: 'Sobrado com área gourmet',
    preco: 890000,
    cidade: 'Taguatinga, DF',
    descricao: 'Sobrado de 240 m² com quatro quartos, duas suítes, sala ampla, cozinha com ilha e área gourmet coberta. Garagem para três veículos e sistema de energia solar.',
    imagem: null
  },
  {
    id: 'demo-6',
    titulo: 'Apartamento compacto no centro',
    preco: 310000,
    cidade: 'Anápolis, GO',
    descricao: 'Apartamento de 58 m² com dois quartos, sala integrada, armários na cozinha e uma vaga. Condomínio econômico e localização próxima ao centro comercial.',
    imagem: null
  },
  {
    id: 'demo-7',
    titulo: 'Casa térrea em condomínio fechado',
    preco: 1150000,
    cidade: 'Valparaíso de Goiás, GO',
    descricao: 'Casa térrea de 230 m² em lote de 420 m², com três suítes, pé-direito alto, cozinha integrada e piscina. Condomínio com segurança e área de lazer completa.',
    imagem: null
  },
  {
    id: 'demo-8',
    titulo: 'Chácara com pomar e nascente',
    preco: 680000,
    cidade: 'Pirenópolis, GO',
    descricao: 'Chácara de 2 hectares com casa de três quartos, varanda, pomar formado, pequena nascente e espaço para criação. Acesso por estrada em boas condições.',
    imagem: null
  },
  {
    id: 'demo-9',
    titulo: 'Loft moderno com pé-direito duplo',
    preco: 395000,
    cidade: 'Goiânia, GO',
    descricao: 'Loft de 52 m² com mezanino, pé-direito duplo, grandes janelas e cozinha equipada. Prédio com coworking, lavanderia compartilhada e academia.',
    imagem: null
  },
  {
    id: 'demo-10',
    titulo: 'Apartamento amplo para família',
    preco: 760000,
    cidade: 'Guará, DF',
    descricao: 'Apartamento de 128 m² com quatro quartos, duas suítes, dependência flexível e duas vagas. Planta bem distribuída, ventilação natural e comércio próximo.',
    imagem: null
  },
  {
    id: 'demo-11',
    titulo: 'Casa reformada com jardim',
    preco: 940000,
    cidade: 'Sobradinho, DF',
    descricao: 'Casa reformada de 260 m² com três suítes, escritório, cozinha planejada e jardim arborizado. Possui varanda, depósito e garagem coberta para dois carros.',
    imagem: null
  },
  {
    id: 'demo-12',
    titulo: 'Kitnet prática próxima ao metrô',
    preco: 185000,
    cidade: 'Ceilândia, DF',
    descricao: 'Kitnet de 28 m² com ambiente bem aproveitado, banheiro reformado e cozinha com bancada. Localizada a cinco minutos do metrô e de mercados.',
    imagem: null
  },
  {
    id: 'demo-13',
    titulo: 'Apartamento com vista para o lago',
    preco: 1480000,
    cidade: 'Brasília, DF',
    descricao: 'Apartamento de 170 m² com três suítes, varanda panorâmica, sala para dois ambientes e acabamento premium. Condomínio com piscina, academia e segurança.',
    imagem: null
  },
  {
    id: 'demo-14',
    titulo: 'Casa de campo com varanda',
    preco: 560000,
    cidade: 'Formosa, GO',
    descricao: 'Casa de campo em terreno de 1.500 m², com três quartos, varanda ampla, churrasqueira e árvores frutíferas. Região silenciosa a poucos quilômetros da cidade.',
    imagem: null
  },
  {
    id: 'demo-15',
    titulo: 'Apartamento novo com lazer completo',
    preco: 545000,
    cidade: 'Samambaia, DF',
    descricao: 'Apartamento novo de 70 m² com três quartos, suíte, varanda e uma vaga. Residencial com piscina, quadra, brinquedoteca, academia e portaria 24 horas.',
    imagem: null
  }
]

function readLocalImoveis() {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_IMOVEIS))
    localStorage.setItem(DEMO_VERSION_KEY, DEMO_VERSION)
    return DEMO_IMOVEIS
  }

  try {
    const imoveis = JSON.parse(stored)
    if (!Array.isArray(imoveis)) throw new Error('Formato local inválido')

    if (localStorage.getItem(DEMO_VERSION_KEY) !== DEMO_VERSION) {
      const demoPorId = new Map(DEMO_IMOVEIS.map((imovel) => [imovel.id, imovel]))
      const migrados = imoveis.map((imovel) => demoPorId.get(imovel.id) ?? imovel)
      const idsExistentes = new Set(migrados.map((imovel) => imovel.id))
      const atualizados = [...migrados, ...DEMO_IMOVEIS.filter((imovel) => !idsExistentes.has(imovel.id))]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(atualizados))
      localStorage.setItem(DEMO_VERSION_KEY, DEMO_VERSION)
      return atualizados
    }
    return imoveis
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_IMOVEIS))
    localStorage.setItem(DEMO_VERSION_KEY, DEMO_VERSION)
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
    try {
      const resultado = await supabase.from('imoveis').select('*')
      if (!resultado.error) return { ...resultado, source: 'remote' }
      console.warn('Supabase indisponível; usando dados locais.', resultado.error.message)
    } catch (error) {
      console.warn('Falha de conexão com o Supabase; usando dados locais.', error)
    }
  }
  return { data: readLocalImoveis(), error: null, source: 'local' }
}

/**
 * CREATE (Criação) — Insere um novo registro na tabela.
 * Equivale ao comando SQL: INSERT INTO imoveis (colunas) VALUES (valores);
 * * @param {Object} imovel — Objeto contendo os campos do imóvel (titulo, preco, cidade, etc).
 * @returns {Promise} Retorna { error } para sabermos se a inserção falhou ou deu certo.
 */
export async function criarImovel(imovel) {
  if (supabase) {
    try {
      const resultado = await supabase.from('imoveis').insert([imovel])
      if (!resultado.error) return { ...resultado, source: 'remote' }
      console.warn('Não foi possível gravar no Supabase; salvando localmente.', resultado.error.message)
    } catch (error) {
      console.warn('Falha de conexão com o Supabase; salvando localmente.', error)
    }
  }
  const imoveis = readLocalImoveis()
  const novoImovel = { ...imovel, id: crypto.randomUUID() }
  writeLocalImoveis([novoImovel, ...imoveis])
  return { data: [novoImovel], error: null, source: 'local' }
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
    try {
      const resultado = await supabase.from('imoveis').update(dados).eq('id', id)
      if (!resultado.error) return { ...resultado, source: 'remote' }
      console.warn('Não foi possível atualizar no Supabase; atualizando localmente.', resultado.error.message)
    } catch (error) {
      console.warn('Falha de conexão com o Supabase; atualizando localmente.', error)
    }
  }
  const imoveis = readLocalImoveis()
  writeLocalImoveis(imoveis.map((imovel) => (
    imovel.id === id ? { ...imovel, ...dados } : imovel
  )))
  return { error: null, source: 'local' }
}

/**
 * DELETE (Exclusão) — Remove permanentemente um registro do banco pelo ID.
 * Equivale ao comando SQL: DELETE FROM imoveis WHERE id = id_informado;
 * * @param {string|number} id — O identificador único do imóvel que será excluído.
 * @returns {Promise} Retorna { error } para validação.
 */
export async function excluirImovel(id) {
  if (supabase) {
    try {
      const resultado = await supabase.from('imoveis').delete().eq('id', id)
      if (!resultado.error) return { ...resultado, source: 'remote' }
      console.warn('Não foi possível excluir no Supabase; removendo localmente.', resultado.error.message)
    } catch (error) {
      console.warn('Falha de conexão com o Supabase; removendo localmente.', error)
    }
  }
  writeLocalImoveis(readLocalImoveis().filter((imovel) => imovel.id !== id))
  return { error: null, source: 'local' }
}
