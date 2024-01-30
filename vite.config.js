import {defineConfig, loadEnv} from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import fs from "fs";

const port = process.env.VITE_PORT || 5173;
const app_host = process.env.APP_HOST || 'localhost';
const ssl_cert_path = process.env.SSL_CERTIFICATE_PATH || './docker/ssl/certs/localhost.crt';
const ssl_key_path = process.env.SSL_CERTIFICATE_KEY_PATH || './docker/ssl/certs/localhost.key';
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
        origin: 'https://'+app_host+':'+port,
        https: {
            key: fs.readFileSync(ssl_key_path),
            cert: fs.readFileSync(ssl_cert_path),
        }
    },
});
