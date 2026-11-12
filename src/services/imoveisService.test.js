// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('./supabase', () => ({ supabase: null }))

const storageValues = new Map()
Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  value: {
    clear: () => storageValues.clear(),
    getItem: (key) => storageValues.get(key) ?? null,
    setItem: (key, value) => storageValues.set(key, String(value)),
    removeItem: (key) => storageValues.delete(key)
  }
})

const { listarImoveis } = await import('./imoveisService')

describe('modo demonstração', () => {
  beforeEach(() => localStorage.clear())

  it('inicia com quinze imóveis detalhados sem Supabase', async () => {
    const { data, error } = await listarImoveis()

    expect(error).toBeNull()
    expect(data).toHaveLength(15)
    data.forEach((imovel) => {
      expect(imovel.titulo.length).toBeGreaterThanOrEqual(5)
      expect(imovel.descricao.length).toBeGreaterThanOrEqual(50)
      expect(imovel.preco).toBeGreaterThan(0)
      expect(imovel.cidade).toMatch(/, (DF|GO)$/)
    })
  })

  it('migra a base antiga e preserva registros criados pelo usuário', async () => {
    localStorage.setItem('imobiliaria-control:imoveis', JSON.stringify([
      { id: 'demo-1', titulo: 'Exemplo antigo', preco: 1, cidade: 'X', descricao: 'Antiga' },
      { id: 'usuario-1', titulo: 'Imóvel do usuário', preco: 350000, cidade: 'Brasília, DF', descricao: 'Registro próprio' }
    ]))

    const { data } = await listarImoveis()

    expect(data).toHaveLength(16)
    expect(data.find((imovel) => imovel.id === 'demo-1').titulo).toContain('Sudoeste')
    expect(data.find((imovel) => imovel.id === 'usuario-1')).toBeTruthy()
  })
})
