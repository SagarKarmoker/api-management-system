# API Management System

A secure, modern API key management system built with TypeScript, Express.js, Prisma ORM, and PostgreSQL.

## Features

- 🚀 **Express.js** - Fast, unopinionated web framework
- 🔷 **TypeScript** - Type-safe JavaScript
- 🗄️ **Prisma ORM** - Modern database toolkit
- 🐘 **PostgreSQL** - Powerful, open source database
- 🐳 **Docker** - Containerized development environment
- 📝 **Morgan** - HTTP request logger middleware
- 🌱 **Database Seeding** - Easy database population with sample data

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- npm or yarn

## Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/SagarKarmoker/api-management-system.git
   cd typescript-backend-starter
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the database**
   ```bash
   docker-compose up -d
   ```

5. **Generate Prisma client**
   ```bash
   npm run prisma:generate
   ```

6. **Run database migrations**
   ```bash
   npm run prisma:migrate
   ```

7. **Seed the database (optional)**
   ```bash
   npm run seed
   ```

## Development

- **Start development server**: `npm run dev`
- **Build for production**: `npm run build`
- **Start production server**: `npm start`
- **Run TypeScript directly**: `npm run start:dev`

## API Key Management

This project provides a secure API key system for authenticating requests.

### 1. Create an API Key

**Endpoint:** `POST /api/v1/api-keys`

**Request Body:**
```json
{
  "user_id": "<user_id>",
  "scopes": ["read", "write"],
  "expires_in_days": 30
}
```

**Response:**
- Returns the generated API key object, including the `full_key` (e.g., `key_xxxxxxxx.<secret>`)

### 2. List API Keys

**Endpoint:** `GET /api/v1/api-keys/keys?user_id=<user_id>`

**Response:**
- Returns a list of API keys for the user.

### 3. Delete (Deactivate) an API Key

**Endpoint:** `DELETE /api/v1/api-keys/keys/:key_id?user_id=<user_id>`

**Response:**
- Marks the API key as deleted (inactive).

### 4. Verify an API Key

**Endpoint:** `GET /api/v1/api-keys/verify`
**Headers:**
```
api-x: <full_key>
```

**Response:**
- `{ "status": "success", "message": "API key is valid" }` if valid
- Error message if invalid, expired, or inactive

### Using the API Key

For protected endpoints, include the following header:
```
api-x: key_xxxxxxxx.<secret>
```

### Seeding and Setup
- Run `npm run seed` to create a test user (see `src/lib/seed.ts`).
- Use the user ID from your database when creating API keys.

---

## Database

- **Generate Prisma client**: `npm run prisma:generate`
- **Run migrations**: `npm run prisma:migrate`
- **Open Prisma Studio**: `npm run prisma:studio`
- **Seed database**: `npm run seed`

## Project Structure

```
├── src/
│   ├── index.ts          # Main application entry point
│   ├── lib/              # Utility libraries
│   │   ├── prisma.ts     # Prisma client instance
│   │   └── seed.ts       # Database seeding script
│   └── generated/        # Generated Prisma client
├── prisma/
│   └── schema.prisma     # Database schema
├── docker-compose.yml    # Docker services configuration
├── package.json          # Dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

## Environment Variables

Create a `.env` file with the following variables:

```env
# Server Configuration
PORT=3000

# Database Configuration
DATABASE_URL="postgresql://postgres:password@localhost:5432/typescript_backend?schema=public"

# Docker PostgreSQL Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=typescript_backend
```

## License

ISC 