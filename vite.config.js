import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import fs from 'fs';

const port = process.env.VITE_PORT || 5173;
const appHost = process.env.APP_HOST || 'localhost';
const sslCertPath = process.env.SSL_CERTIFICATE_PATH || './docker/ssl/certs/localhost.crt';
const sslKeyPath = process.env.SSL_CERTIFICATE_KEY_PATH || './docker/ssl/certs/localhost.key';
export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.tsx',
            refresh: true,
        }),
        react(),
    ],
    server: {
        host: '0.0.0.0',
        origin: `https://${appHost}:${port}`,
        https: {
            key: fs.readFileSync(sslKeyPath),
            cert: fs.readFileSync(sslCertPath),
        },
    },
});
