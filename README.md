# Cafe195

A full-stack coffee shop ordering platform built with React, Node.js, Express, and MongoDB.

## Project Overview

Cafe195 is a coffee shop ordering web application where customers can browse menu items, manage a cart-style ordering workflow, create an account, and interact with a simple customer dashboard. The application also includes admin-oriented flows for managing products, orders, and user accounts.

The project is designed around a typical full-stack workflow: a React frontend communicates with an Express REST API, and the backend persists application data in MongoDB. This structure demonstrates frontend/backend integration, authenticated API requests, CRUD workflows, and database-backed application state.

As a portfolio project, Cafe195 highlights practical full-stack development skills, including REST API design, MongoDB Atlas integration, role-based dashboard behavior, environment configuration, and deployment-ready project organization.

## Demo / Screenshots

### Home Page

![Cafe195 home page](asset/homepage.png)

### Drink Section

![Cafe195 drink section](asset/drink-section.png)

### Food Section

![Cafe195 food section](asset/food-section.png)

### Signup Page

![Cafe195 signup page](asset/signup-page.png)

## Features

### Customer Features

- Browse coffee shop food and drink menu sections
- Add, remove, and update cart quantities
- Register and log in to an account
- View and manage customer profile information
- Create and manage the current user's orders

### Admin Features

- Manage food and drink menu items through protected CRUD routes
- View, update, and delete orders
- View, update, and delete user accounts
- Use role-protected dashboard behavior for admin workflows

### Engineering Features

- React frontend integrated with an Express REST API
- MongoDB-backed persistence with Mongoose models
- CRUD operations for users, orders, foods, and drinks
- JWT-based authentication middleware
- Frontend/backend separation using npm workspaces
- API testing and debugging support with tools such as Postman
- Deployment-ready structure with Render configuration

## Tech Stack

### Frontend

- React
- JavaScript
- HTML
- CSS
- Vite
- React Router

### Backend

- Node.js
- Express.js
- REST APIs
- JWT authentication
- Mongoose

### Database

- MongoDB
- MongoDB Atlas

### Tools & Practices

- Git
- GitHub
- Postman
- VS Code
- npm workspaces
- Render configuration
- Environment-based configuration

## Architecture

```text
React Frontend
      |
Express REST API
      |
MongoDB Atlas
```

The frontend communicates with the backend through REST endpoints. The backend handles authentication, route protection, CRUD operations, and database access through Mongoose models.

## Repository Structure

```text
.
|-- client/        # React frontend built with Vite
|-- server/        # Express backend API, routes, controllers, and models
|-- .env.example   # Placeholder environment variable template
|-- render.yaml    # Render deployment configuration
|-- package.json   # Root npm workspace scripts
`-- README.md      # Project documentation
```

Notable backend folders:

- `server/controllers/` - request handlers for users, orders, foods, and drinks
- `server/routes/` - Express route definitions
- `server/models/` - Mongoose data models
- `server/middleware/` - authentication and role-based middleware
- `server/config/` - MongoDB connection setup

Notable frontend files:

- `client/src/App.jsx` - main application routes
- `client/src/api.js` - shared API request helper
- `client/src/Admin.jsx` - admin dashboard view
- `client/src/Customer.jsx` - customer dashboard view
- `client/src/drinkPage.jsx` and `client/src/foodPage.jsx` - menu sections

## Installation & Setup

1. Clone the repository:

```bash
git clone https://github.com/ameeshajaswal/Cafe-195.git
cd Cafe-195
```

2. Install dependencies from the repository root:

```bash
npm install
```

The project uses npm workspaces for `client` and `server`, so installing from the root installs the workspace dependencies.

3. Create local environment files from `.env.example`.

For the backend, create `server/.env`:

```bash
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

For the frontend, create `client/.env`:

```bash
VITE_API_URL=http://localhost:5000
```

4. Start the backend and frontend together from the repository root:

```bash
npm run dev
```

5. Optional separate commands:

```bash
npm run server
npm run client
```

6. Build the frontend:

```bash
npm run build
```

## Environment Variables

Use placeholder values only in committed files:

```bash
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
VITE_API_URL=http://localhost:5000
```

Real secrets must never be committed to version control. Keep local secrets in ignored `.env` files and configure production secrets through the deployment platform.

## API / Backend Notes

The Express backend exposes REST endpoints for account, order, food, drink, and cart workflows. MongoDB stores persistent application data for users, orders, and menu items, while Mongoose models define the application data structure.

The backend includes protected routes that require a valid JWT, plus admin-only user management routes. Postman or similar tools can be used to test authentication, CRUD requests, and order-management workflows during development.

## Development Notes

- The frontend and backend can run together from the root with `npm run dev`.
- The frontend can also run separately with `npm run client`.
- The backend can also run separately with `npm run server`.
- MongoDB Atlas or a local MongoDB connection can be used depending on the configured `MONGO_URI`.
- `.env.example` documents the required variable names without exposing real values.
- `node_modules` and local `.env` files should not be committed.

## Challenges & Lessons Learned

- Designing integration between a React frontend and an Express backend
- Managing CRUD workflows across products, orders, and accounts
- Connecting MongoDB Atlas securely through environment configuration
- Handling authentication and role-based access patterns
- Debugging API requests across frontend and backend boundaries
- Organizing a full-stack project for local development and deployment

## Future Improvements

- Online payment simulation
- Improved authentication and authorization controls
- Order status tracking
- Admin analytics dashboard
- Product image upload and management
- Email or order notifications
- Improved responsive UI polish
- Automated backend and frontend tests

## License / Purpose

This project was developed for educational, portfolio, and demonstration purposes.
