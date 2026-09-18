import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@/assets/global.css';
import { App } from '@/app/App';

const ADMIN_BASE = '/admin';
const { pathname, search, hash } = window.location;
if (pathname !== ADMIN_BASE && !pathname.startsWith(`${ADMIN_BASE}/`)) {
  window.history.replaceState(null, '', `${ADMIN_BASE}${pathname}${search}${hash}`);
}

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found');
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
