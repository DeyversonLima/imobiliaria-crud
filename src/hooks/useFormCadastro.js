import { useState } from "react";

/**
 * useFormCadastro
 * Hook que encapsula estado, validação e submissão do formulário de imóvel.
 * Uso: const { campos, erros, tocados, status, carregando, handleChange,
 *              handleBlur, handleSubmit, handlePrecoChange } = useFormCadastro(onSubmitFn);
 */

const CAMPOS_INICIAIS = {
  titulo: "",
  preco: "",
  cidade: "",
  descricao: "",
  imagem: "",
};

export function validarCampos(campos) {
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

export function useFormCadastro(onSubmitFn) {
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
      const { erros: novosErros } = validarCampos(novosCampos);
      setErros((prev) => ({ ...prev, [name]: novosErros[name] || "" }));
    }
  }

  function handlePrecoChange(e) {
    const raw = e.target.value.replace(/\D/g, "");
    const valor = raw ? (Number(raw) / 100).toFixed(2) : "";
    const novosCampos = { ...campos, preco: valor };
    setCampos(novosCampos);
    if (tocados["preco"]) {
      const { erros: novosErros } = validarCampos(novosCampos);
      setErros((prev) => ({ ...prev, preco: novosErros["preco"] || "" }));
    }
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTocados((prev) => ({ ...prev, [name]: true }));
    const { erros: novosErros } = validarCampos(campos);
    setErros((prev) => ({ ...prev, [name]: novosErros[name] || "" }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const todosTocados = Object.keys(campos).reduce(
      (acc, k) => ({ ...acc, [k]: true }),
      {}
    );
    setTocados(todosTocados);

    const { erros: novosErros, valido } = validarCampos(campos);
    setErros(novosErros);
    if (!valido) return;

    setCarregando(true);
    setStatus(null);

    try {
      await onSubmitFn({
        titulo: campos.titulo.trim(),
        preco: Number(campos.preco),
        cidade: campos.cidade.trim(),
        descricao: campos.descricao.trim(),
        imagem: campos.imagem.trim() || null,
      });
      setStatus("sucesso");
      setCampos(CAMPOS_INICIAIS);
      setTocados({});
      setErros({});
    } catch {
      setStatus("erro");
    } finally {
      setCarregando(false);
    }
  }

  return {
    campos,
    erros,
    tocados,
    status,
    carregando,
    handleChange,
    handlePrecoChange,
    handleBlur,
    handleSubmit,
  };
}
