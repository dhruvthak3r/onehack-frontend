import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { Auth0Provider } from '@auth0/auth0-react';

import './index.css';

const root = createRoot(document.getElementById('root')!);

root.render(
  <Auth0Provider
    domain="dev-b8uv1i5k42wqw5ej.us.auth0.com"
    clientId="c2zw1g7eUXntGZ1AIFvU9jDHPGtGtnXf"
    authorizationParams={{
      redirect_uri: `${window.location.origin}/callback`,
      audience: "https://onehack.dev/api",
      scope: "openid profile email offline_access",
    }}
  >
    <App />
  </Auth0Provider>
);
