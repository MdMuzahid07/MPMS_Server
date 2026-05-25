# MPMS Server (Backend)

The server architecture for the Minimal Project Management System (MPMS) is a highly scalable, strictly-typed RESTful API built on Node.js and Express. It serves as the single source of truth for the MPMS ecosystem, enforcing robust authorization rules, rigorous data validation, and optimized interactions with the MongoDB data layer.

## 🚀 Tech Stack

- **Runtime**: [Node.js](https://nodejs.org)
- **Framework**: [Express.js](https://expressjs.com)
- **Language**: [TypeScript](https://www.typescriptlang.org) (Strict Mode)
- **Database**: [MongoDB](https://www.mongodb.com)
- **ORM / ODM**: [Mongoose](https://mongoosejs.com)
- **Validation**: [Zod](https://zod.dev)
- **Authentication**: JWT (JSON Web Tokens) & Bcrypt
- **Media Uploads**: [Multer](https://github.com/expressjs/multer) & [Cloudinary](https://cloudinary.com)
- **Security**: Helmet, Express-Rate-Limit, Express-Mongo-Sanitize, CORS, HPP

## 📁 Architecture Overview

The backend is built utilizing a highly decoupled **Modular Controller-Service-Route** architectural pattern.

Inside `src/app/`:

- **`modules/`**: Contains core feature boundaries (e.g., `task`, `sprint`, `user`, `auth`). Each module acts as a micro-domain containing its own:
  - `*.model.ts`: Mongoose schemas and interface models.
  - `*.controller.ts`: Express route handlers managing HTTP lifecycles and response shaping.
  - `*.service.ts`: Core business logic interacting with the database layer.
  - `*.routes.ts`: Modular Express router definitions.
  - `*.validation.ts`: Zod schema validators intercepting payload malformations.
- **`middlewares/`**: Global interceptors orchestrating concerns such as:
  - `authorizationGuard`: Enforces fine-grained role-based access control (RBAC).
  - `requestValidator`: Seamlessly integrates Zod validations with Express pipelines.
  - Error handlers capturing `AppError` instances and responding with standardized JSON envelopes.
- **`utils/`**: Shared infrastructure utilities including `catchAsync` wrappers, standard response builders, and logger configurations.

## 🌟 Key Features

1. **Strict Data Integrity**: Comprehensive end-to-end type safety. Zod validators strictly enforce payload types and shapes before any execution reaches the service logic. Enum enforcement (e.g., `"TODO" | "IN_PROGRESS"`) guarantees database conformity.
2. **Granular Authorization**: Built-in Role-Based Access Control allowing routes to uniquely restrict operations based on identity roles (`ADMIN`, `MANAGER`, `MEMBER`).
3. **Advanced Querying capabilities**: Specialized builders handling dynamic filtering, sparse fieldsets, pagination, and sorting directly parsed from frontend API parameters.
4. **Resilient Security Layers**: Automatically rate-limits API floods, sanitizes incoming NoSQL injections, hardens HTTP headers via Helmet, and protects against HTTP parameter pollution.
5. **Seamless Asset Management**: Native integration with Cloudinary enabling secure, rapid, and scalable uploading for project assets and task attachments.

## 🛠️ Getting Started

### Prerequisites

- Node.js >= 18.0.0
- A running MongoDB instance (Local or Atlas URI)
- Cloudinary Account (for media uploads)

### Installation

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Required variables to define in .env:
# PORT=5000
# DATABASE_URL=mongodb+srv://...
# JWT_ACCESS_SECRET=your_secret
# CLOUDINARY_CLOUD_NAME=...
# CLOUDINARY_API_KEY=...
# CLOUDINARY_API_SECRET=...

# Run the development server (uses ts-node-dev for rapid hot-reloads)
npm run dev
```

The REST API will execute locally at `http://localhost:5000`.

## 📝 Scripts

- `npm run dev`: Starts the application in development mode with active hot-reloading.
- `npm run build`: Compiles TypeScript into the `/dist` production directory.
- `npm run start`: Executes the compiled production application.
- `npm run lint` / `npm run prettier`: Triggers comprehensive codebase styling and static analysis.
- `npm run seed-admin`: Securely seeds the initial global Administrator account into the MongoDB database.
