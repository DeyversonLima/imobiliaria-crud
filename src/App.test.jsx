import { render } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import App from './App'

// Simula a conexão com o Supabase para o teste não quebrar na nuvem do GitHub
vi.mock('./supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockResolvedValue({ data: [], error: null })
    }))
  }
}))

describe('Testes de infraestrutura - App', () => {
  it('deve renderizar o componente principal sem falhar', () => {
    // Renderiza o App na memória do robô
    const { container } = render(<App />)
    
    // Verifica se o App foi renderizado (se existe conteúdo)
    expect(container).toBeInTheDocument()
  })
})
