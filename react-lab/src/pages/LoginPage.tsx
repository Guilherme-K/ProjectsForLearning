import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { AuthAside } from '../components/AuthAside'
import { Icone } from '../components/Icone'

export function LoginPage() {
  const { usuario, login, carregando } = useAuth()
  const navegar = useNavigate()
  const localizacao = useLocation()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [erro, setErro] = useState('')

  const estado = localizacao.state as { de?: string } | null
  const destino = estado?.de ?? '/dashboard'

  if (usuario) {
    return <Navigate to={destino} replace />
  }

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    setErro('')

    if (!email.trim() || !senha) {
      setErro('Preencha o e-mail e a senha para continuar.')
      return
    }

    try {
      await login(email, senha)
      navegar(destino, { replace: true })
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : 'Não foi possível entrar. Tente novamente.',
      )
    }
  }

  function preencherDemo() {
    setEmail('demo@reactlab.dev')
    setSenha('123456')
    setErro('')
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
              <Icone nome="fa-shield-halved" tamanho={26} />
            </span>

            <h1>Entrar na sua conta</h1>
            <p className="auth-subtitle">
              Acesse o dashboard protegido. A autenticação é simulada e os dados
              ficam salvos neste navegador.
            </p>

            <form className="form-stack" onSubmit={enviar} noValidate>
              {erro && (
                <div className="form-error" role="alert">
                  <Icone nome="fa-circle-exclamation" tamanho={17} />
                  <span>{erro}</span>
                </div>
              )}

              <div className="field">
                <label htmlFor="login-email">E-mail</label>
                <div className="input-wrap">
                  <Icone
                    nome="fa-envelope"
                    tamanho={17}
                    className="input-leading"
                  />
                  <input
                    id="login-email"
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
                <label htmlFor="login-senha">Senha</label>
                <div className="input-wrap">
                  <Icone nome="fa-lock" tamanho={17} className="input-leading" />
                  <input
                    id="login-senha"
                    type={mostrarSenha ? 'text' : 'password'}
                    className="has-leading has-trailing"
                    placeholder="Sua senha"
                    autoComplete="current-password"
                    value={senha}
                    onChange={(evento) => setSenha(evento.target.value)}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setMostrarSenha((visivel) => !visivel)}
                    aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    <Icone
                      nome={mostrarSenha ? 'fa-eye-slash' : 'fa-eye'}
                      tamanho={17}
                    />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary auth-submit"
                disabled={carregando}
              >
                <Icone
                  nome={carregando ? 'fa-spinner' : 'fa-lock'}
                  tamanho={18}
                  className={carregando ? 'spin' : undefined}
                />
                {carregando ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            <div className="demo-box">
              <strong>Conta de demonstração</strong>
              <p>
                E-mail: <code>demo@reactlab.dev</code>
                <br />
                Senha: <code>123456</code>
              </p>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={preencherDemo}
              >
                Preencher automaticamente
              </button>
            </div>

            <p className="auth-alt">
              Ainda não tem conta? <Link to="/cadastro">Criar conta</Link>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
