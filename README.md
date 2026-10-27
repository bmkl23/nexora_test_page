# NexOra storefront (React + Vite)

    npm install
    npm run dev        # http://localhost:5173

Dev requests go to /api/* and Vite proxies them to API Gateway (see vite.config.js), so no CORS errors.
Production: set VITE_API_BASE to the full API Gateway URL and enable CORS on the gateway.

Flow: `/` theme picker -> `/shop` storefront rendered from the selected config.
Paths to verify in src/api/client.js: /design-configs, /design-configs/:id, POST /design-configs.
