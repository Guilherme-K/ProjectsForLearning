import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// O terminal Python usa SharedArrayBuffer para bloquear o worker enquanto
// espera input(). Esses cabeçalhos habilitam crossOriginIsolated no dev e no
// preview. "credentialless" mantém o carregamento de fontes e do CDN funcionando.
const cabecalhosIsolamento = {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'credentialless',
  'Cross-Origin-Resource-Policy': 'cross-origin',
}

export default defineConfig({
  plugins: [react()],
  server: {
    headers: cabecalhosIsolamento,
  },
  preview: {
    headers: cabecalhosIsolamento,
  },
})
