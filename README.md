# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

npm install
npx tailwindcss -i ./src/input.css -o ./src/output.css --watch
npm run dev

## Testing

Unit + component tests → Vitest + React Testing Library
Hook tests → RTL renderHook
Optional: E2E → Cypress or Playwright
npx playwright init (to delete ~/Library/Caches/ms-playwright)

Add testing scripts in package.json
"scripts": {
"dev": "vite",
"test": "vitest",
"test:watch": "vitest --watch"
}
