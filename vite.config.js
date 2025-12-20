import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import postcsspxtoviewport from 'postcss-px-to-viewport-8-plugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        postcsspxtoviewport({
          viewportWidth: 375,
          viewportHeight: 667,
          unitPrecision: 5,
          viewportUnit: 'vw',
          selectorBlackList: [],
          minPixelValue: 1,
          mediaQuery: false,
          exclude: []
        })
      ]
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://auracncloud.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
