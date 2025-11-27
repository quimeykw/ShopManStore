---
inclusion: always
---

# Technology Stack

## Backend

- **Runtime**: Node.js (>=18.0.0)
- **Framework**: Express.js
- **Database**: SQLite3 with sqlite3 package
- **Authentication**: JWT (jsonwebtoken) + bcryptjs for password hashing
- **Payment**: Mercado Pago SDK v2
- **Middleware**: cors for CORS handling

## Frontend

- **Vanilla JavaScript** (no framework)
- **Tailwind CSS** via CDN for styling
- **Font Awesome** for icons
- Single Page Application (SPA) pattern

## Environment Variables

- `PORT`: Server port (default: 3001)
- `JWT_SECRET`: JWT signing secret (default: 'shopmanstore_secret_key_2024')
- `MP_TOKEN`: Mercado Pago access token (optional)
- `NODE_ENV`: Environment mode

## Common Commands

```bash
# Install dependencies
npm install

# Start server
npm start

# Server runs on http://localhost:3001
```

## Database

SQLite database (`store.db`) is created automatically on first run with tables:
- `users` - User accounts with roles
- `products` - Product catalog
- `orders` - Order history
- `logs` - System activity logs

## API Structure

RESTful API with `/api` prefix:
- Authentication endpoints use JWT tokens
- Admin routes protected with `auth` + `isAdmin` middleware
- All responses in JSON format
