import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

// Передаем прелоадер во все дочерние процессы Vitest
const preloadFlag = '--require ./vitest.preload.cjs';
if (!process.env.NODE_OPTIONS?.includes(preloadFlag)) {
    process.env.NODE_OPTIONS = [process.env.NODE_OPTIONS, preloadFlag]
        .filter(Boolean)
        .join(' ');
}

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './vitest.setup.ts',
        execArgv: ['--require', './vitest.preload.cjs'],
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './'),
        },
    },
});