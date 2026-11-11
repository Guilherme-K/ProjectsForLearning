import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

export interface Usuario {
  id: string
  nome: string
  email: string
}

interface UsuarioArmazenado extends Usuario {
  senha: string
}

interface AuthContextValue {
  usuario: Usuario | null
  carregando: boolean
  login: (email: string, senha: string) => Promise<void>
  registrar: (nome: string, email: string, senha: string) => Promise<void>
  logout: () => void
}

const USUARIOS_KEY = 'react-lab:usuarios'
const SESSAO_KEY = 'react-lab:sessao'

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const usuariosIniciais: UsuarioArmazenado[] = [
  {
    id: 'demo',
    nome: 'Usuário Demo',
    email: 'demo@reactlab.dev',
    senha: '123456',
  },
]

function lerUsuarios(): UsuarioArmazenado[] {
  try {
    const salvos = window.localStorage.getItem(USUARIOS_KEY)
    if (!salvos) {
      window.localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuariosIniciais))
      return usuariosIniciais
    }
    const lista = JSON.parse(salvos) as UsuarioArmazenado[]
    return Array.isArray(lista) ? lista : usuariosIniciais
  } catch {
    return usuariosIniciais
  }
}

function lerSessao(): Usuario | null {
  try {
    const salva = window.localStorage.getItem(SESSAO_KEY)
    return salva ? (JSON.parse(salva) as Usuario) : null
  } catch {
    return null
  }
}

function simularRequisicao(ms = 650): Promise<void> {
  return new Promise((resolver) => window.setTimeout(resolver, ms))
}

function gerarId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `usuario-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function paraUsuario(armazenado: UsuarioArmazenado): Usuario {
  return {
    id: armazenado.id,
    nome: armazenado.nome,
    email: armazenado.email,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(lerSessao)
  const [carregando, setCarregando] = useState(false)

  const persistirSessao = useCallback((novoUsuario: Usuario | null) => {
    try {
      if (novoUsuario) {
        window.localStorage.setItem(SESSAO_KEY, JSON.stringify(novoUsuario))
      } else {
        window.localStorage.removeItem(SESSAO_KEY)
      }
    } catch {
      // A sessão continua válida em memória mesmo sem localStorage.
    }
    setUsuario(novoUsuario)
  }, [])

  const login = useCallback(
    async (email: string, senha: string) => {
      setCarregando(true)
      try {
        await simularRequisicao()
        const usuarios = lerUsuarios()
        const encontrado = usuarios.find(
          (item) =>
            item.email.toLowerCase() === email.trim().toLowerCase() &&
            item.senha === senha,
        )

        if (!encontrado) {
          throw new Error('E-mail ou senha inválidos. Confira os dados e tente novamente.')
        }

        persistirSessao(paraUsuario(encontrado))
      } finally {
        setCarregando(false)
      }
    },
    [persistirSessao],
  )

  const registrar = useCallback(
    async (nome: string, email: string, senha: string) => {
      setCarregando(true)
      try {
        await simularRequisicao()
        const usuarios = lerUsuarios()
        const emailNormalizado = email.trim().toLowerCase()

        if (usuarios.some((item) => item.email.toLowerCase() === emailNormalizado)) {
          throw new Error('Já existe uma conta com este e-mail.')
        }

        const novoUsuario: UsuarioArmazenado = {
          id: gerarId(),
          nome: nome.trim(),
          email: emailNormalizado,
          senha,
        }

        try {
          window.localStorage.setItem(
            USUARIOS_KEY,
            JSON.stringify([...usuarios, novoUsuario]),
          )
        } catch {
          throw new Error('Não foi possível salvar a conta neste navegador.')
        }

        persistirSessao(paraUsuario(novoUsuario))
      } finally {
        setCarregando(false)
      }
    },
    [persistirSessao],
  )

  const logout = useCallback(() => persistirSessao(null), [persistirSessao])

  const valor = useMemo(
    () => ({ usuario, carregando, login, registrar, logout }),
    [usuario, carregando, login, registrar, logout],
  )

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const contexto = useContext(AuthContext)

  if (!contexto) {
    throw new Error('useAuth deve ser usado dentro de <AuthProvider>.')
  }

  return contexto
}
