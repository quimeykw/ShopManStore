---
inclusion: always
---

# Project Structure

```
shopmanstore/
├── public/                 # Frontend assets
│   ├── index.html         # Main HTML (SPA shell)
│   └── app.js             # Client-side JavaScript
├── server.js              # Express backend + API routes
├── store.db               # SQLite database (auto-generated)
├── package.json           # Dependencies and scripts
├── .env.example           # Environment variables template
└── deploy files           # Various deployment configs
```

## Architecture Pattern

**Monolithic SPA**: Single Express server serving both static frontend and REST API.

## Code Organization

### Backend (server.js)

- Database initialization and schema
- Middleware setup (cors, json parsing, static files)
- Authentication middleware (`auth`, `isAdmin`)
- API routes grouped by resource:
  - `/api/login`, `/api/register` - Authentication
  - `/api/products` - Product CRUD
  - `/api/users` - User management
  - `/api/orders` - Order processing
  - `/api/logs` - Activity logs
  - `/api/mp-link` - Mercado Pago integration
- Catch-all route for SPA routing

### Frontend (public/app.js)

- Global state: `user`, `token`, `products`, `cart`
- DOM manipulation using `$` helper
- Event handlers setup in `setupEvents()`
- Feature modules:
  - Auth (login/register)
  - Products (display, cart management)
  - Payment (card, Mercado Pago, WhatsApp)
  - Admin panel (products, users, logs)

## Conventions

- Use `const` for immutable values
- Arrow functions preferred
- Template literals for HTML generation
- Async/await for API calls
- Base64 encoding for image uploads
- Tailwind utility classes for styling
- Spanish language for all user-facing text
