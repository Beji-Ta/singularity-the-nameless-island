import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages はリポジトリ名がサブパスになる（例: /ro-guild-map/）
// ローカル開発時は '/' で動作する
export default defineConfig({
  plugins: [react()],
  base: './',   // 相対パスにすることで GitHub Pages の任意のリポジトリ名に対応
})
