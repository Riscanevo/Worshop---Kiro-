import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            output: {
                manualChunks: function (id) {
                    if (id.indexOf('node_modules') === -1)
                        return;
                    if (id.indexOf('primereact') !== -1)
                        return 'primereact-vendor';
                    if (id.indexOf('primeicons') !== -1 || id.indexOf('primeflex') !== -1)
                        return 'prime-ui';
                    if (/node_modules\/(react|react-dom|scheduler)\//.test(id))
                        return 'react-core';
                    if (id.indexOf('@zxing') !== -1)
                        return 'scanner';
                    if (id.indexOf('date-fns') !== -1)
                        return 'date-fns';
                    return 'vendor';
                },
            },
        },
    },
    resolve: {
        alias: {
            '@': '/src',
        },
    },
    server: {
        port: 3000,
        host: true,
    },
});
