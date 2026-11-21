import { z } from "zod";

const onlyDigits = (value: string) => value.replace(/\D/g, "");

/** Confere os dígitos verificadores do CPF. */
export function isValidCpf(value: string): boolean {
  const cpf = onlyDigits(value);
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  const digit = (len: number) => {
    let sum = 0;
    for (let i = 0; i < len; i++) sum += Number(cpf[i]) * (len + 1 - i);
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };
  return digit(9) === Number(cpf[9]) && digit(10) === Number(cpf[10]);
}

export const UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA",
  "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
] as const;

export const checkoutSchema = z.object({
  name: z.string().trim().min(3, "Digite seu nome completo.").refine((v) => v.includes(" "), "Inclua o sobrenome."),
  email: z.string().trim().email("E-mail inválido."),
  cpf: z.string().refine(isValidCpf, "CPF inválido."),
  phone: z.string().refine((v) => onlyDigits(v).length === 11, "Celular com DDD, ex.: (11) 91234-5678."),
  cep: z.string().refine((v) => onlyDigits(v).length === 8, "CEP com 8 dígitos."),
  street: z.string().trim().min(3, "Informe a rua."),
  number: z.string().trim().min(1, "Informe o número."),
  district: z.string().trim().min(2, "Informe o bairro."),
  city: z.string().trim().min(2, "Informe a cidade."),
  state: z.enum(UFS, { errorMap: () => ({ message: "Escolha o estado." }) }),
});

export type CheckoutForm = z.input<typeof checkoutSchema>;

export interface ViaCepAddress {
  street: string;
  district: string;
  city: string;
  state: string;
}

/** Busca o endereço pelo CEP (ViaCEP). Devolve null se o CEP não existir. */
export async function lookupCep(cep: string): Promise<ViaCepAddress | null> {
  const digits = onlyDigits(cep);
  if (digits.length !== 8) return null;
  const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
  if (!response.ok) return null;
  const data = await response.json();
  if (data.erro) return null;
  return { street: data.logradouro, district: data.bairro, city: data.localidade, state: data.uf };
}
