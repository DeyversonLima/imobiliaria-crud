// App.jsx — sugestão para integrar o CadastroImovel
// Compatível com o main.jsx atual (sem BrowserRouter)
// Quando o Gabriel subir o roteamento, substituir pela versão com <Route>

import { useEffect, useState } from 'react'
import { supabase } from './services/supabase'
import CadastroImovel from './pages/CadastroImovel'

function App() {
  const [imoveis, setImoveis] = useState([])
  const [pagina, setPagina] = useState('home') // 'home' | 'cadastro'

  useEffect(() => {
    buscarImoveis()
  }, [])

  async function buscarImoveis() {
    const { data, error } = await supabase.from('imoveis').select('*')
    if (error) console.log('Erro:', error)
    else setImoveis(data)
  }

  if (pagina === 'cadastro') {
    return (
      <>
        <button onClick={() => setPagina('home')}>← Voltar</button>
        <CadastroImovel
          onCadastroSucesso={() => {
            buscarImoveis()
            setPagina('home')
          }}
        />
      </>
    )
  }

  return (
    <div>
      <h1>Imobiliária — CRUD de Imóveis</h1>
      <button onClick={() => setPagina('cadastro')}>+ Cadastrar Imóvel</button>

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
