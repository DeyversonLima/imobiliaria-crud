import React from 'react'
import { useEffect, useState } from 'react'
import { supabase } from './services/supabase'

function App() {
  const [imoveis, setImoveis] = useState([])

  useEffect(() => {
    buscarImoveis()
  }, [])

  async function buscarImoveis() {
    const { data, error } = await supabase
      .from('imoveis')
      .select('*')

    if (error) {
      console.log('Erro:', error)
    } else {
      setImoveis(data)
    }
  }

  return (
    <div>
      <h1>Imobiliária — CRUD de Imóveis</h1>

      {imoveis.map((imovel) => (
        <div key={imovel.id}>
          <h2>{imovel.titulo}</h2>
          <p>{imovel.cidade}</p>
          <p>R$ {imovel.preco}</p>
        </div>
      ))}
    </div>
  )
}

export default App
