import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // 환경 변수 로드
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      port: 3000,
      open: true,
      host: true
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            ui: ['react-markdown', '@uiw/react-json-view']
          }
        }
      }
    },
    resolve: {
      alias: {
        '@': '/src'
      }
    },
    // 환경 변수 명시적 정의
    define: {
      __VITE_DOMAIN__: JSON.stringify(env.VITE_DOMAIN),
      __VITE_DEV_MODE__: JSON.stringify(env.VITE_DEV_MODE),
    }
  }
})
