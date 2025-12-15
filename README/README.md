# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Backend Configuration

The application connects to a backend API server. The backend URL is configured in `src/config/backend.js`.

### Available Backend Servers
- **Primary Server**: `192.168.0.190:8000`
- **Alternative Server**: `13.233.21.121:8000`

To change the backend server, update the `IP` value in `src/config/backend.js`.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
