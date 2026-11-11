import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { HomePage } from './pages/HomePage'
import { TodoPage } from './pages/TodoPage'
import { CounterPage } from './pages/CounterPage'
import { CalculatorPage } from './pages/CalculatorPage'
import { CepPage } from './pages/CepPage'
import { WeatherPage } from './pages/WeatherPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { DashboardPage } from './pages/DashboardPage'
import { NotFoundPage } from './pages/NotFoundPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="tarefas" element={<TodoPage />} />
            <Route path="contador" element={<CounterPage />} />
            <Route path="calculadora" element={<CalculatorPage />} />
            <Route path="cep" element={<CepPage />} />
            <Route path="clima" element={<WeatherPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="cadastro" element={<RegisterPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="dashboard" element={<DashboardPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
