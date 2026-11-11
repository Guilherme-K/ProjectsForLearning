import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Rota protegida: sem sessão ativa, o usuário é enviado ao login
 * e depois retorna para a página que tentou acessar.
 */
export function ProtectedRoute() {
  const { usuario } = useAuth()
  const localizacao = useLocation()

  if (!usuario) {
    return <Navigate to="/login" replace state={{ de: localizacao.pathname }} />
  }

  return <Outlet />
}
