import { useEffect, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'

/**
 * Estado sincronizado com o localStorage.
 * O valor inicial é usado apenas quando ainda não existe nada salvo.
 */
export function useLocalStorage<T>(
  chave: string,
  valorInicial: T,
): [T, Dispatch<SetStateAction<T>>] {
  const [valor, setValor] = useState<T>(() => {
    try {
      const salvo = window.localStorage.getItem(chave)
      return salvo ? (JSON.parse(salvo) as T) : valorInicial
    } catch {
      return valorInicial
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(chave, JSON.stringify(valor))
    } catch {
      // O armazenamento pode estar indisponível (modo privado, cota etc.).
    }
  }, [chave, valor])

  return [valor, setValor]
}
