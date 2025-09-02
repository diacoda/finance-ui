/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,            // enable test, expect, describe, etc.
    environment: 'jsdom',     // simulate browser environment for React
    setupFiles: './src/setupTests.js', // optional: for jest-dom matchers
  },
})
