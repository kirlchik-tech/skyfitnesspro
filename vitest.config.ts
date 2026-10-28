import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./vitest.setup.ts'],
    },
    resolve: {
        alias: {
            // Чтобы Vitest понимал пути через @/ (например, @/components/UI/Button)
            '@': path.resolve(__dirname, './'),
        },
    },
});