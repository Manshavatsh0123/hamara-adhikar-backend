# Hamara Adhikar Backend

Backend service for the **Hamara Adhikar** platform.

This project exposes the Government Knowledge Base through secure, scalable REST APIs and serves as the central business logic layer between PostgreSQL and frontend applications.

The backend is designed to support:

- Government Scheme Search
- Category & Department Browsing
- Eligibility Matching
- AI-powered Recommendations
- Voice Assistant
- Future Mobile Applications

---

# Vision

The Hamara Adhikar backend acts as the bridge between structured government scheme data and end users.

It provides clean REST APIs that allow frontend applications and AI systems to retrieve, search, filter, and recommend government welfare schemes.

The backend is designed with scalability, modularity, and maintainability in mind.

---

# Architecture

```
                    Hamara Adhikar

        Government Knowledge Base Repository
                     │
                     ▼
            PostgreSQL Database
                     │
                     ▼
            Express.js Backend (This Repo)
                     │
        ┌────────────┼─────────────┐
        │            │             │
        ▼            ▼             ▼
 React Frontend   AI Assistant   Voice Assistant
```

---

# Responsibilities

This repository is responsible for:

- Connecting to PostgreSQL
- Exposing REST APIs
- Business Logic
- Scheme Search
- Category Filtering
- Department Filtering
- Eligibility Matching
- Recommendation Engine
- AI Integration
- Validation
- Error Handling

This repository **does not store government data**.

Government data is maintained in:

```
hamara-adhikar-knowledge-base
```

---

# Tech Stack

Current

- Node.js
- Express.js
- PostgreSQL
- pg
- dotenv

Future

- OpenAI API
- JWT Authentication
- Redis Cache
- Docker
- Swagger Documentation

---

# Project Structure

```
hamara-adhikar-backend/

├── src/
│
├── config/
│   ├── db.js
│   ├── env.js
│   └── constants.js
│
├── routes/
│   ├── health.routes.js
│   ├── scheme.routes.js
│   ├── category.routes.js
│   ├── department.routes.js
│   ├── search.routes.js
│   ├── recommendation.routes.js
│   └── ai.routes.js
│
├── controllers/
│   ├── health.controller.js
│   ├── scheme.controller.js
│   ├── category.controller.js
│   ├── department.controller.js
│   ├── search.controller.js
│   ├── recommendation.controller.js
│   └── ai.controller.js
│
├── services/
│   ├── scheme.service.js
│   ├── search.service.js
│   ├── recommendation.service.js
│   ├── eligibility.service.js
│   └── ai.service.js
│
├── repositories/
│   ├── scheme.repository.js
│   ├── search.repository.js
│   ├── category.repository.js
│   └── recommendation.repository.js
│
├── middleware/
│   ├── error.middleware.js
│   ├── validation.middleware.js
│   ├── logger.middleware.js
│   └── notFound.middleware.js
│
├── validators/
│   ├── search.validator.js
│   ├── recommendation.validator.js
│   └── scheme.validator.js
│
├── utils/
│   ├── response.js
│   ├── logger.js
│   └── pagination.js
│
├── app.js
└── server.js
│
├── package.json
├── .env
├── .gitignore
└── README.md
```

---

# Folder Explanation

## config/

Application configuration.

Contains:

- PostgreSQL Connection
- Environment Variables
- Constants

---

## routes/

Defines all API endpoints.

Routes are responsible only for mapping HTTP requests to controllers.

No business logic should exist here.

---

## controllers/

Receives HTTP requests.

Responsibilities:

- Read request
- Call Service Layer
- Return JSON response

---

## services/

Contains business logic.

Examples:

- Search algorithm
- Recommendation engine
- Eligibility matching
- AI orchestration

Services never communicate directly with HTTP.

---

## repositories/

Responsible only for database operations.

Contains SQL queries.

Examples:

- Find Scheme
- Search Scheme
- Fetch Categories
- Recommendation Query

Repositories never contain business logic.

---

## middleware/

Application middleware.

Examples:

- Global Error Handler
- Request Validation
- Logging
- 404 Handler

---

## validators/

Request validation.

Validates incoming API payloads before reaching business logic.

---

## utils/

Reusable helper functions.

Examples:

- Standard API Response
- Pagination
- Logger

---

# Request Flow

Every request follows the same architecture.

```
Client

↓

Routes

↓

Controller

↓

Service

↓

Repository

↓

PostgreSQL

↓

Repository

↓

Service

↓

Controller

↓

JSON Response
```

---

# API Roadmap

## Health

```
GET /api/health
```

Returns application status.

Example

```json
{
    "success": true,
    "message": "Backend is running."
}
```

---

## Schemes

```
GET /api/schemes
```

Returns all schemes.

---

```
GET /api/schemes/:id
```

Returns a single scheme.

---

## Categories

```
GET /api/categories
```

Returns all categories.

---

```
GET /api/categories/:category
```

Returns schemes under a category.

---

## Departments

```
GET /api/departments
```

Returns all departments.

---

```
GET /api/departments/:department
```

Returns schemes for a department.

---

## Search

```
GET /api/search?q=student
```

Performs keyword search.

Searches across:

- Scheme Name
- Description
- Categories
- Search Text

---

## Suggestions

```
GET /api/search/suggestions?q=stu
```

Returns autocomplete suggestions.

---

## Recommendation

```
POST /api/recommendations
```

Returns the most relevant schemes based on user information.

Future input:

- Age
- Gender
- Occupation
- Income
- State

---

## Eligibility

```
POST /api/eligibility
```

Checks eligibility for schemes.

---

## AI

```
POST /api/ai/chat
```

Future AI endpoint.

Receives natural language queries and returns simplified scheme recommendations.

---

# Development Roadmap

## Phase 1

- Express Setup
- PostgreSQL Connection
- Health API
- Schemes API

Status

🚧 In Progress

---

## Phase 2

- Categories API
- Department API
- Search API

Status

📋 Planned

---

## Phase 3

- Recommendation Engine
- Eligibility API
- AI Integration

Status

📋 Planned

---

## Phase 4

- Authentication
- User Profiles
- Bookmarks
- Recent Searches

Status

📋 Planned

---

# Development Workflow

```
Frontend Request

↓

Express Route

↓

Controller

↓

Service

↓

Repository

↓

PostgreSQL

↓

JSON Response

↓

Frontend
```

---

# Related Repositories

This backend is part of the **Hamara Adhikar** ecosystem.

- hamara-adhikar-knowledge-base
- hamara-adhikar-backend
- hamara-adhikar-frontend

---

# Running the Project

Install dependencies

```bash
npm install
```

Create environment file

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=hamara_adhikar
PORT=5000
```

Start development server

```bash
npm run dev
```

Start production server

```bash
npm start
```

---

# First API

Health Check

```
GET /api/health
```

Example Response

```json
{
    "success": true,
    "message": "Hamara Adhikar Backend is running successfully.",
    "version": "1.0.0"
}
```

---

# License

This project is licensed under the MIT License.

---

# Maintained By

**Hamara Adhikar**

Building an AI-powered platform to make government welfare schemes easier to discover, understand, and access for every citizen.
