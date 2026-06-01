import React from 'react'
import { render } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import '@testing-library/jest-dom' // Essencial para o toBeInTheDocument funcionar!
import App from './App'

// Finge a conexão com o banco de dados para o teste não travar
vi.mock('./services/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockResolvedValue({ data: [], error: null })
    }))
  }
}))

describe('Testes de infraestrutura - App', () => {
  it('deve renderizar o componente principal sem falhar', () => {
    // Renderiza a interface do App
    const { container } = render(<App />)
    
    // Verifica se ela foi desenhada na tela virtual com sucesso
    expect(container).toBeInTheDocument()
  })
})
