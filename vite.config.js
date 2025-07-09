import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/kikundi-harvest-crop-1.00/',
  plugins: [react()],
  build:{outDir:'docs'}});
