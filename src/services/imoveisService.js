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

/**
 * READ (Leitura) — Busca todos os registros.
 * Equivale ao comando SQL: SELECT * FROM imoveis;
 * * @returns {Promise} Retorna um objeto contendo { data, error }.
 * 'data' é um array com todos os imóveis encontrados, e 'error' traz falhas se houver.
 */
export async function listarImoveis() {
  return await supabase
    .from('imoveis') // Define qual tabela do banco de dados será consultada
    .select('*')    // O '*' indica que queremos buscar TODAS as colunas dessa tabela
}

/**
 * CREATE (Criação) — Insere um novo registro na tabela.
 * Equivale ao comando SQL: INSERT INTO imoveis (colunas) VALUES (valores);
 * * @param {Object} imovel — Objeto contendo os campos do imóvel (titulo, preco, cidade, etc).
 * @returns {Promise} Retorna { error } para sabermos se a inserção falhou ou deu certo.
 */
export async function criarImovel(imovel) {
  return await supabase
    .from('imoveis')     // Define a tabela alvo
    .insert([imovel])    // O Supabase espera receber um array de objetos, por isso usamos colchetes [ ]
}

/**
 * UPDATE (Atualização) — Altera dados de um registro existente baseado no ID.
 * Equivale ao comando SQL: UPDATE imoveis SET colunas = valores WHERE id = id_informado;
 * * @param {string|number} id — O identificador único do imóvel que queremos alterar.
 * @param {Object} dados — Objeto contendo apenas os campos e novos valores que queremos modificar.
 * @returns {Promise} Retorna { error } para checagem de sucesso.
 */
export async function atualizarImovel(id, dados) {
  return await supabase
    .from('imoveis')       // Define a tabela alvo
    .update(dados)         // Passa o objeto com as colunas que receberão novos valores
    .eq('id', id)          // Cláusula de filtro (Equal/Igual). ATENÇÃO: Sem isso, atualizaríamos a tabela inteira! 
                           // Diz para o banco: "Apenas onde a coluna 'id' for igual ao 'id' que passei por parâmetro".
}

/**
 * DELETE (Exclusão) — Remove permanentemente um registro do banco pelo ID.
 * Equivale ao comando SQL: DELETE FROM imoveis WHERE id = id_informado;
 * * @param {string|number} id — O identificador único do imóvel que será excluído.
 * @returns {Promise} Retorna { error } para validação.
 */
export async function excluirImovel(id) {
  return await supabase
    .from('imoveis')       // Define a tabela alvo
    .delete()              // Ativa o comando de deleção de registro
    .eq('id', id)          // Cláusula de filtro (Equal/Igual). IMPORTANTE: Garante que o Supabase delete 
                           // APENAS a linha específica que possui esse ID correspondente.
}