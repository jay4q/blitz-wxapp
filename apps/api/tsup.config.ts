import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['./index.js'],
  outDir: '../../wxapp-dist/functions/wxapp-api',
})
