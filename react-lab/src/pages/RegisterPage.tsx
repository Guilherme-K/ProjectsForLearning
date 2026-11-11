import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { AuthAside } from '../components/AuthAside'
import { Icone } from '../components/Icone'

export function RegisterPage() {
  const { usuario, registrar, carregando } = useAuth()
  const navegar = useNavigate()

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmacao, setConfirmacao] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [erro, setErro] = useState('')

  if (usuario) {
    return <Navigate to="/dashboard" replace />
  }

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    setErro('')

    if (nome.trim().length < 2) {
      setErro('Informe um nome com pelo menos 2 caracteres.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErro('Informe um e-mail válido.')
      return
    }

    if (senha.length < 6) {
      setErro('A senha precisa ter pelo menos 6 caracteres.')
      return
    }

    if (senha !== confirmacao) {
      setErro('As senhas não coincidem.')
      return
    }

    try {
      await registrar(nome, email, senha)
      navegar('/dashboard', { replace: true })
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : 'Não foi possível criar a conta. Tente novamente.',
      )
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <AuthAside />

        <div className="auth-container">
          <Link to="/" className="auth-back">
            <Icone nome="fa-chevron-left" tamanho={16} />
            Voltar ao início
          </Link>

          <section className="panel auth-card">
            <span className="auth-icon">
              <Icone nome="fa-user-plus" tamanho={26} />
            </span>

            <h1>Criar uma conta</h1>
            <p className="auth-subtitle">
              Cadastre-se para acessar a rota protegida. A conta é criada
              localmente, sem enviar dados para um servidor.
            </p>

            <form className="form-stack" onSubmit={enviar} noValidate>
              {erro && (
                <div className="form-error" role="alert">
                  <Icone nome="fa-circle-exclamation" tamanho={17} />
                  <span>{erro}</span>
                </div>
              )}

              <div className="field">
                <label htmlFor="cadastro-nome">Nome</label>
                <div className="input-wrap">
                  <Icone nome="fa-user" tamanho={17} className="input-leading" />
                  <input
                    id="cadastro-nome"
                    type="text"
                    className="has-leading"
                    placeholder="Seu nome"
                    autoComplete="name"
                    value={nome}
                    onChange={(evento) => setNome(evento.target.value)}
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="cadastro-email">E-mail</label>
                <div className="input-wrap">
                  <Icone
                    nome="fa-envelope"
                    tamanho={17}
                    className="input-leading"
                  />
                  <input
                    id="cadastro-email"
                    type="email"
                    className="has-leading"
                    placeholder="voce@exemplo.com"
                    autoComplete="email"
                    value={email}
                    onChange={(evento) => setEmail(evento.target.value)}
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="cadastro-senha">Senha</label>
                <div className="input-wrap">
                  <Icone nome="fa-lock" tamanho={17} className="input-leading" />
                  <input
                    id="cadastro-senha"
                    type={mostrarSenha ? 'text' : 'password'}
                    className="has-leading has-trailing"
                    placeholder="Mínimo de 6 caracteres"
                    autoComplete="new-password"
                    value={senha}
                    onChange={(evento) => setSenha(evento.target.value)}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setMostrarSenha((visivel) => !visivel)}
                    aria-label={mostrarSenha ? 'Ocultar senhas' : 'Mostrar senhas'}
                  >
                    <Icone
                      nome={mostrarSenha ? 'fa-eye-slash' : 'fa-eye'}
                      tamanho={17}
                    />
                  </button>
                </div>
              </div>

              <div className="field">
                <label htmlFor="cadastro-confirmacao">Confirmar senha</label>
                <div className="input-wrap">
                  <Icone nome="fa-lock" tamanho={17} className="input-leading" />
                  <input
                    id="cadastro-confirmacao"
                    type={mostrarSenha ? 'text' : 'password'}
                    className="has-leading"
                    placeholder="Repita a senha"
                    autoComplete="new-password"
                    value={confirmacao}
                    onChange={(evento) => setConfirmacao(evento.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary auth-submit"
                disabled={carregando}
              >
                <Icone
                  nome={carregando ? 'fa-spinner' : 'fa-user-plus'}
                  tamanho={18}
                  className={carregando ? 'spin' : undefined}
                />
                {carregando ? 'Criando conta...' : 'Criar conta e entrar'}
              </button>
            </form>

            <p className="auth-alt">
              Já tem uma conta? <Link to="/login">Entrar</Link>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
