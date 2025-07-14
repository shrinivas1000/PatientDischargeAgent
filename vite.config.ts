import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/agents/patient-discharge-agent/',
  server: {
    host: '::',
    port: 8080,
  },
  plugins: [react()],
});
