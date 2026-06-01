import { useState } from "react";
import { supabase } from "../services/supabase";  // caminho correto do projeto
import "./CadastroImovel.css";

const CAMPOS_INICIAIS = {
  titulo: "",
  preco: "",
  cidade: "",
  descricao: "",
  imagem: "",
};

function validar(campos) {
  const erros = {};
  let valido = true;

  if (!campos.titulo.trim()) {
    erros.titulo = "O título é obrigatório.";
    valido = false;
  } else if (campos.titulo.trim().length < 5) {
    erros.titulo = "O título deve ter pelo menos 5 caracteres.";
    valido = false;
  }

  if (!campos.preco) {
    erros.preco = "O preço é obrigatório.";
    valido = false;
  } else if (isNaN(Number(campos.preco)) || Number(campos.preco) <= 0) {
    erros.preco = "Informe um preço válido (número positivo).";
    valido = false;
  }

  if (!campos.cidade.trim()) {
    erros.cidade = "A cidade é obrigatória.";
    valido = false;
  } else if (campos.cidade.trim().length < 3) {
    erros.cidade = "Informe uma cidade válida.";
    valido = false;
  }

  if (!campos.descricao.trim()) {
    erros.descricao = "A descrição é obrigatória.";
    valido = false;
  } else if (campos.descricao.trim().length < 10) {
    erros.descricao = "A descrição deve ter pelo menos 10 caracteres.";
    valido = false;
  }

  if (campos.imagem && !/^https?:\/\/.+\..+/.test(campos.imagem.trim())) {
    erros.imagem = "Informe uma URL de imagem válida (http/https).";
    valido = false;
  }

  return { erros, valido };
}

export default function CadastroImovel() {
  const [campos, setCampos] = useState(CAMPOS_INICIAIS);
  const [erros, setErros] = useState({});
  const [tocados, setTocados] = useState({});
  const [status, setStatus] = useState(null);
  const [carregando, setCarregando] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    const novosCampos = { ...campos, [name]: value };
    setCampos(novosCampos);
    if (tocados[name]) {
      const { erros: novosErros } = validar(novosCampos);
      setErros((prev) => ({ ...prev, [name]: novosErros[name] || "" }));
    }
  }

  function handlePrecoChange(e) {
    const raw = e.target.value.replace(/\D/g, "");
    const valor = raw ? (Number(raw) / 100).toFixed(2) : "";
    const novosCampos = { ...campos, preco: valor };
    setCampos(novosCampos);
    if (tocados["preco"]) {
      const { erros: novosErros } = validar(novosCampos);
      setErros((prev) => ({ ...prev, preco: novosErros["preco"] || "" }));
    }
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTocados((prev) => ({ ...prev, [name]: true }));
    const { erros: novosErros } = validar(campos);
    setErros((prev) => ({ ...prev, [name]: novosErros[name] || "" }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const todosTocados = Object.keys(campos).reduce(
      (acc, k) => ({ ...acc, [k]: true }),
      {}
    );
    setTocados(todosTocados);

    const { erros: novosErros, valido } = validar(campos);
    setErros(novosErros);
    if (!valido) return;

    setCarregando(true);
    setStatus(null);

    try {
      const { error } = await supabase.from("imoveis").insert([
        {
          titulo: campos.titulo.trim(),
          preco: Number(campos.preco),
          cidade: campos.cidade.trim(),
          descricao: campos.descricao.trim(),
          imagem: campos.imagem.trim() || null,
        },
      ]);

      if (error) throw error;

      setStatus("sucesso");
      setCampos(CAMPOS_INICIAIS);
      setTocados({});
      setErros({});
    } catch (err) {
      console.error(err);
      setStatus("erro");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="cadastro-wrapper">
      <div className="cadastro-card">
        <header className="cadastro-header">
          <div className="cadastro-icon">🏠</div>
          <h1>Cadastrar Imóvel</h1>
          <p>Preencha os dados abaixo para anunciar seu imóvel</p>
        </header>

        {status === "sucesso" && (
          <div className="alerta alerta-sucesso" role="alert">
            <span>✓</span> Imóvel cadastrado com sucesso!
          </div>
        )}
        {status === "erro" && (
          <div className="alerta alerta-erro" role="alert">
            <span>✕</span> Erro ao cadastrar. Verifique os dados e tente novamente.
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="cadastro-form">
          {/* Título */}
          <div className={`campo-grupo ${erros.titulo && tocados.titulo ? "invalido" : ""}`}>
            <label htmlFor="titulo">
              Título <span className="obrigatorio">*</span>
            </label>
            <input
              id="titulo"
              name="titulo"
              type="text"
              placeholder="Ex: Apartamento 2 quartos no centro"
              value={campos.titulo}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={100}
              aria-describedby="titulo-erro"
              aria-invalid={!!(erros.titulo && tocados.titulo)}
            />
            {erros.titulo && tocados.titulo && (
              <span id="titulo-erro" className="erro-msg" role="alert">
                {erros.titulo}
              </span>
            )}
          </div>

          {/* Preço */}
          <div className={`campo-grupo ${erros.preco && tocados.preco ? "invalido" : ""}`}>
            <label htmlFor="preco">
              Preço (R$) <span className="obrigatorio">*</span>
            </label>
            <div className="input-prefix">
              <span>R$</span>
              <input
                id="preco"
                name="preco"
                type="text"
                inputMode="numeric"
                placeholder="0,00"
                value={campos.preco}
                onChange={handlePrecoChange}
                onBlur={handleBlur}
                aria-describedby="preco-erro"
                aria-invalid={!!(erros.preco && tocados.preco)}
              />
            </div>
            {erros.preco && tocados.preco && (
              <span id="preco-erro" className="erro-msg" role="alert">
                {erros.preco}
              </span>
            )}
          </div>

          {/* Cidade */}
          <div className={`campo-grupo ${erros.cidade && tocados.cidade ? "invalido" : ""}`}>
            <label htmlFor="cidade">
              Cidade <span className="obrigatorio">*</span>
            </label>
            <input
              id="cidade"
              name="cidade"
              type="text"
              placeholder="Ex: São Paulo, SP"
              value={campos.cidade}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={80}
              aria-describedby="cidade-erro"
              aria-invalid={!!(erros.cidade && tocados.cidade)}
            />
            {erros.cidade && tocados.cidade && (
              <span id="cidade-erro" className="erro-msg" role="alert">
                {erros.cidade}
              </span>
            )}
          </div>

          {/* Descrição */}
          <div className={`campo-grupo ${erros.descricao && tocados.descricao ? "invalido" : ""}`}>
            <label htmlFor="descricao">
              Descrição <span className="obrigatorio">*</span>
            </label>
            <textarea
              id="descricao"
              name="descricao"
              placeholder="Descreva o imóvel: características, diferenciais, localização..."
              value={campos.descricao}
              onChange={handleChange}
              onBlur={handleBlur}
              rows={4}
              maxLength={500}
              aria-describedby="descricao-erro"
              aria-invalid={!!(erros.descricao && tocados.descricao)}
            />
            <span className="contador">{campos.descricao.length}/500</span>
            {erros.descricao && tocados.descricao && (
              <span id="descricao-erro" className="erro-msg" role="alert">
                {erros.descricao}
              </span>
            )}
          </div>

          {/* Imagem */}
          <div className={`campo-grupo ${erros.imagem && tocados.imagem ? "invalido" : ""}`}>
            <label htmlFor="imagem">
              URL da Imagem <span className="opcional">(opcional)</span>
            </label>
            <input
              id="imagem"
              name="imagem"
              type="url"
              placeholder="https://exemplo.com/foto.jpg"
              value={campos.imagem}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-describedby="imagem-erro"
              aria-invalid={!!(erros.imagem && tocados.imagem)}
            />
            {campos.imagem && !erros.imagem && (
              <div className="preview-imagem">
                <img
                  src={campos.imagem}
                  alt="Prévia"
                  onError={(e) => (e.target.style.display = "none")}
                />
              </div>
            )}
            {erros.imagem && tocados.imagem && (
              <span id="imagem-erro" className="erro-msg" role="alert">
                {erros.imagem}
              </span>
            )}
          </div>

          <button type="submit" className="btn-cadastrar" disabled={carregando}>
            {carregando ? (
              <><span className="spinner" /> Cadastrando...</>
            ) : (
              "Cadastrar Imóvel"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
