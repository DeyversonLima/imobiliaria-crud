// @vitest-environment jsdom
import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import '@testing-library/jest-dom'
import App from './App'

// Finge a conexão com o banco de dados para o teste não travar
vi.mock('./services/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockResolvedValue({ data: [], error: null })
    }))
  }
}))

describe('Testes de Integração - Tela Principal', () => {
  it('deve renderizar o título da Imobiliária na tela', () => {
    // Renderiza a interface do App na memória do robô
    render(<App />)
    
    // Procura o título exato que está no seu App.jsx
    const titulo = screen.getByText('Imobiliária Control')
    
    // Valida se o título realmente apareceu na tela
    expect(titulo).toBeInTheDocument()
  })
})
