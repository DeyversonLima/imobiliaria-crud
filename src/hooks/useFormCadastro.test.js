import { describe, it, expect } from "vitest";
import { validarCampos } from "../hooks/useFormCadastro";

describe("validarCampos", () => {
  const camposValidos = {
    titulo: "Apartamento amplo no centro",
    preco: "350000.00",
    cidade: "São Paulo",
    descricao: "Imóvel espaçoso com ótima localização.",
    imagem: "https://exemplo.com/foto.jpg",
  };

  it("retorna valido=true para dados corretos", () => {
    const { valido } = validarCampos(camposValidos);
    expect(valido).toBe(true);
  });

  // ── título ──────────────────────────────────────
  it("exige título não vazio", () => {
    const { erros, valido } = validarCampos({ ...camposValidos, titulo: "" });
    expect(valido).toBe(false);
    expect(erros.titulo).toBeTruthy();
  });

  it("exige título com pelo menos 5 caracteres", () => {
    const { erros, valido } = validarCampos({ ...camposValidos, titulo: "Casa" });
    expect(valido).toBe(false);
    expect(erros.titulo).toMatch(/5/);
  });

  it("aceita título com exatamente 5 caracteres", () => {
    const { erros } = validarCampos({ ...camposValidos, titulo: "Apart" });
    expect(erros.titulo).toBeFalsy();
  });

  // ── preço ────────────────────────────────────────
  it("exige preço não vazio", () => {
    const { erros, valido } = validarCampos({ ...camposValidos, preco: "" });
    expect(valido).toBe(false);
    expect(erros.preco).toBeTruthy();
  });

  it("rejeita preço zero", () => {
    const { erros, valido } = validarCampos({ ...camposValidos, preco: "0" });
    expect(valido).toBe(false);
    expect(erros.preco).toBeTruthy();
  });

  it("rejeita preço negativo", () => {
    const { erros, valido } = validarCampos({ ...camposValidos, preco: "-500" });
    expect(valido).toBe(false);
    expect(erros.preco).toBeTruthy();
  });

  it("rejeita preço não numérico", () => {
    const { erros, valido } = validarCampos({ ...camposValidos, preco: "abc" });
    expect(valido).toBe(false);
    expect(erros.preco).toBeTruthy();
  });

  it("aceita preço válido positivo", () => {
    const { erros } = validarCampos({ ...camposValidos, preco: "1200.00" });
    expect(erros.preco).toBeFalsy();
  });

  // ── cidade ───────────────────────────────────────
  it("exige cidade não vazia", () => {
    const { erros, valido } = validarCampos({ ...camposValidos, cidade: "" });
    expect(valido).toBe(false);
    expect(erros.cidade).toBeTruthy();
  });

  it("exige cidade com pelo menos 3 caracteres", () => {
    const { erros, valido } = validarCampos({ ...camposValidos, cidade: "SP" });
    expect(valido).toBe(false);
    expect(erros.cidade).toBeTruthy();
  });

  it("aceita cidade com 3 caracteres", () => {
    const { erros } = validarCampos({ ...camposValidos, cidade: "Rio" });
    expect(erros.cidade).toBeFalsy();
  });

  // ── descrição ────────────────────────────────────
  it("exige descrição não vazia", () => {
    const { erros, valido } = validarCampos({ ...camposValidos, descricao: "" });
    expect(valido).toBe(false);
    expect(erros.descricao).toBeTruthy();
  });

  it("exige descrição com pelo menos 10 caracteres", () => {
    const { erros, valido } = validarCampos({ ...camposValidos, descricao: "Curta" });
    expect(valido).toBe(false);
    expect(erros.descricao).toMatch(/10/);
  });

  it("aceita descrição com exatamente 10 caracteres", () => {
    const { erros } = validarCampos({ ...camposValidos, descricao: "1234567890" });
    expect(erros.descricao).toBeFalsy();
  });

  // ── imagem (opcional) ────────────────────────────
  it("aceita imagem vazia (campo opcional)", () => {
    const { erros, valido } = validarCampos({ ...camposValidos, imagem: "" });
    expect(valido).toBe(true);
    expect(erros.imagem).toBeFalsy();
  });

  it("rejeita URL de imagem sem http/https", () => {
    const { erros, valido } = validarCampos({ ...camposValidos, imagem: "foto.jpg" });
    expect(valido).toBe(false);
    expect(erros.imagem).toBeTruthy();
  });

  it("aceita URL de imagem com https", () => {
    const { erros } = validarCampos({
      ...camposValidos,
      imagem: "https://site.com/img.jpg",
    });
    expect(erros.imagem).toBeFalsy();
  });

  it("aceita URL de imagem com http", () => {
    const { erros } = validarCampos({
      ...camposValidos,
      imagem: "http://site.com/img.png",
    });
    expect(erros.imagem).toBeFalsy();
  });

  // ── múltiplos erros simultâneos ──────────────────
  it("retorna múltiplos erros quando vários campos são inválidos", () => {
    const { erros, valido } = validarCampos({
      titulo: "",
      preco: "",
      cidade: "",
      descricao: "",
      imagem: "",
    });
    expect(valido).toBe(false);
    expect(erros.titulo).toBeTruthy();
    expect(erros.preco).toBeTruthy();
    expect(erros.cidade).toBeTruthy();
    expect(erros.descricao).toBeTruthy();
  });
});
