# Hamara Adhikar --- Backend API {#hamara-adhikar--backend-api}

Backend service for **Hamara Adhikar**, an AI-assisted government-scheme
discovery, recommendation, eligibility and application-guidance
platform.

## 1. Complete User Flow {#1-complete-user-flow}

``` text
User
  ↓
POST /api/ai/chat
  ↓
PostgreSQL scheme retrieval
  ↓
Relevant schemes
  ↓
Gemini explanation
  ↓
POST /api/recommendations
  ↓
User selects a scheme
  ↓
POST /api/eligibility
  ↓
eligibility_rules
  ↓
Eligible / Not Eligible + reasons
  ↓
GET /api/schemes/:id/application
  ↓
scheme_content
  ↓
Application steps + documents + official links
```

## 2. Backend Architecture {#2-backend-architecture}

``` text
Client / Frontend
      ↓
Express API
      ↓
Routes
      ↓
Controllers
      ↓
Services
      ↓
Repositories
      ↓
PostgreSQL
```

AI/RAG:

``` text
POST /api/ai/chat
      ↓
AI Controller
      ↓
AI Service
      ↓
AI Repository
      ↓
PostgreSQL
      ↓
Top matching schemes
      ↓
Gemini
      ↓
Grounded response
```

Eligibility:

``` text
POST /api/eligibility
      ↓
Eligibility Controller
      ↓
Eligibility Service
      ↓
Eligibility Repository
      ↓
eligibility_rules
      ↓
Compare age/gender/state/occupation/income/caste/disability
      ↓
Result + reasons
```

Application:

``` text
GET /api/schemes/:id/application
      ↓
Application Controller
      ↓
Application Service
      ↓
Application Repository
      ↓
scheme_content
```

## 3. Project Structure {#3-project-structure}

``` text
hamara-adhikar-backend/
├── src/
│   ├── config/
│   │   ├── db.js
│   │   └── env.js
│   ├── controllers/
│   │   ├── ai.controller.js
│   │   ├── application.controller.js
│   │   ├── category.controller.js
│   │   ├── department.controller.js
│   │   ├── eligibility.controller.js
│   │   ├── health.controller.js
│   │   ├── recommendation.controller.js
│   │   ├── scheme.controller.js
│   │   └── search.controller.js
│   ├── repositories/
│   │   ├── ai.repository.js
│   │   ├── application.repository.js
│   │   ├── category.repository.js
│   │   ├── department.repository.js
│   │   ├── eligibility.repository.js
│   │   ├── recommendation.repository.js
│   │   ├── scheme.repository.js
│   │   └── search.repository.js
│   ├── routes/
│   ├── services/
│   ├── validators/
│   ├── middleware/
│   │   ├── error.middleware.js
│   │   ├── notFound.middleware.js
│   │   ├── rateLimit.middleware.js
│   │   └── validate.middleware.js
│   ├── app.js
│   └── server.js
├── .env
├── package.json
└── README.md
```

## 4. Database Structure {#4-database-structure}

``` text
schemes
   ├── scheme_content
   ├── eligibility_rules
   ├── scheme_categories
   └── scheme_tags
```

### schemes

``` text
id
scheme_code
scheme_name
department
state
description
```

### scheme_content

``` text
id
scheme_id
objectives
benefits
eligibility
application_process
documents_required
official_source
important_notes
faqs
```

Application information already exists here, so a separate
`scheme_applications` table is not currently required.

### eligibility_rules

``` text
id
scheme_id
min_age
max_age
gender
state text[]
occupation text[]
caste text[]
income_limit
disability
```

The eligibility service dynamically calculates the result. An
`eligibility_reports` table is not currently required because every
check does not need to be persisted.

## 5. ER Diagram {#5-er-diagram}

``` mermaid
erDiagram
    SCHEMES {
        int id PK
        text scheme_code
        text scheme_name
        text department
        varchar state
        text description
    }

    SCHEME_CONTENT {
        int id PK
        int scheme_id FK
        jsonb objectives
        jsonb benefits
        jsonb eligibility
        jsonb application_process
        jsonb documents_required
        jsonb official_source
        jsonb important_notes
        jsonb faqs
    }

    ELIGIBILITY_RULES {
        int id PK
        int scheme_id FK
        int min_age
        int max_age
        varchar gender
        text_array state
        text_array occupation
        text_array caste
        bigint income_limit
        boolean disability
    }

    SCHEME_CATEGORIES {
        int id PK
        int scheme_id FK
    }

    SCHEME_TAGS {
        int id PK
        int scheme_id FK
    }

    SCHEMES ||--o| SCHEME_CONTENT : has
    SCHEMES ||--o{ ELIGIBILITY_RULES : has
    SCHEMES ||--o{ SCHEME_CATEGORIES : belongs_to
    SCHEMES ||--o{ SCHEME_TAGS : has
```

## 6. API Map {#6-api-map}

``` text
Health
├── GET /api/health

Schemes
├── GET /api/schemes
├── GET /api/schemes/:id
├── GET /api/schemes/code/:code
└── GET /api/schemes/random

Categories
├── GET /api/categories
└── GET /api/categories/:category

Departments
├── GET /api/departments
└── GET /api/departments/:department

Search
├── GET /api/search
└── GET /api/search/suggestions

Eligibility
└── POST /api/eligibility

Recommendations
└── POST /api/recommendations

AI
└── POST /api/ai/chat

Statistics
└── GET /api/stats

Application
└── GET /api/schemes/:id/application

States
└── GET /api/states   [next endpoint]
```

## 7. Random Schemes API {#7-random-schemes-api}

``` text
GET /api/schemes/random
```

Uses the existing `schemes` table. No separate random table is needed.

``` text
GET /api/schemes/random
      ↓
Scheme Controller
      ↓
Scheme Service
      ↓
Scheme Repository
      ↓
PostgreSQL
      ↓
Random scheme rows
```

If the controller gives
`ReferenceError: schemeRepository is not defined`, import it in the
controller:

``` js
const schemeRepository = require("../repositories/scheme.repository");
```

## 8. Statistics API {#8-statistics-api}

``` text
GET /api/stats
```

Uses aggregate queries against existing tables. No statistics table is
required.

Typical metrics:

``` text
totalSchemes
totalCategories
totalDepartments
totalEligibilityRules
```

Conceptual flow:

``` text
GET /api/stats
      ↓
Stats Controller
      ↓
Stats Service
      ↓
Stats Repository
      ↓
PostgreSQL COUNT queries
      ↓
Statistics response
```

## 9. States API --- Next {#9-states-api--next}

``` text
GET /api/states
```

Because states already exist in `schemes.state`, a POST `/api/states` is
not required.

Recommended query:

``` sql
SELECT DISTINCT state
FROM schemes
WHERE state IS NOT NULL
  AND TRIM(state) <> ''
ORDER BY state;
```

Only create a separate states table and POST/PUT/DELETE APIs if states
later become independently managed master data.

## 10. AI / Natural Language Search {#10-ai--natural-language-search}

The system should understand:

``` text
I am a student from Bihar
I am a postgraduate student from Bihar
I am a 22-year-old female student from Bihar, General category
Which schemes are suitable for me?
```

Example interpretation:

``` text
"I am a student from Bihar"

state = Bihar
student intent = true
occupation = Student
```

Flow:

``` text
Normal language
      ↓
Intent / important attributes
      ↓
PostgreSQL retrieval
      ↓
Relevant schemes
      ↓
Gemini
      ↓
Answer grounded in database context
```

## 11. Recommendation API {#11-recommendation-api}

``` text
POST /api/recommendations
```

``` text
User profile
    ↓
Recommendation API
    ↓
Relevant schemes
    ↓
User selects scheme
    ↓
Eligibility API
```

Recommendation asks:

> Which schemes may suit me?

Eligibility asks:

> Am I actually eligible?

## 12. Eligibility API {#12-eligibility-api}

Request:

``` json
{
  "schemeId": 1,
  "age": 22,
  "gender": "Female",
  "state": "Bihar",
  "occupation": "Student",
  "income": 200000,
  "caste": "General",
  "disability": false
}
```

Eligible response:

``` json
{
  "success": true,
  "data": {
    "eligible": true,
    "message": "You are eligible for this scheme.",
    "nextStep": "You can proceed with the application.",
    "reasons": []
  }
}
```

Not eligible response:

``` json
{
  "success": true,
  "data": {
    "eligible": false,
    "message": "You are not eligible for this scheme.",
    "nextStep": "Please review the eligibility requirements and explore other schemes.",
    "reasons": [
      "Age criteria not satisfied",
      "Gender criteria not satisfied",
      "State criteria not satisfied"
    ]
  }
}
```

The current implementation checks all criteria and returns multiple
failed reasons.

## 13. Application API {#13-application-api}

``` text
GET /api/schemes/:id/application
```

Reads:

``` text
scheme_content.application_process
scheme_content.documents_required
scheme_content.official_source
```

Possible official source fields:

``` text
email
website
helpline
apply_link
status_link
download_link
```

Flow:

``` text
Eligible
   ↓
Scheme details
   ↓
Application process
   ↓
Required documents
   ↓
Official portal
   ↓
Apply Now
```

## 14. Complete End-to-End Flow {#14-complete-end-to-end-flow}

``` text
                         USER
                           |
                           v
              "I am a student from Bihar"
                           |
                 +---------+---------+
                 |                   |
                 v                   v
           /api/ai/chat        /api/search
                 |                   |
                 +---------+---------+
                           |
                           v
                    Relevant schemes
                           |
                           v
                 /api/recommendations
                           |
                           v
                    User selects scheme
                           |
                           v
                   /api/eligibility
                           |
                           v
                   eligibility_rules
                           |
                +----------+----------+
                |                     |
                v                     v
            ELIGIBLE             NOT ELIGIBLE
                |                     |
                v                     v
        Application API          Show reasons
                |
                v
          scheme_content
                |
        +-------+-------+--------+
        |               |        |
       Steps           Docs    Official links
```

## 15. Middleware

The middleware layer is implemented and is part of the active backend architecture.

```text
src/middleware/
├── error.middleware.js
├── notFound.middleware.js
├── rateLimit.middleware.js
└── validate.middleware.js
```

### Middleware responsibilities

```text
error.middleware.js
    ↓
Centralized application/runtime error handling

notFound.middleware.js
    ↓
Handles requests for routes that do not exist

rateLimit.middleware.js
    ↓
Limits repeated requests

validate.middleware.js
    ↓
Runs request validation before controller logic
```

Recommended Express order:

```text
1. Express/config
2. CORS/security
3. JSON parser
4. Rate limiter
5. API routes
6. notFound middleware
7. error middleware
```

The middleware layer should remain separate from business logic. Controllers should receive validated input and focus on request/response handling.

---

## 16. Validators

The validator layer is also implemented.

```text
src/validators/
├── ai.validator.js
├── eligibility.validator.js
└── recommendation.validator.js
```

### Validator responsibilities

```text
ai.validator.js
    ↓
Validates POST /api/ai/chat

eligibility.validator.js
    ↓
Validates POST /api/eligibility

recommendation.validator.js
    ↓
Validates POST /api/recommendations
```

### Validation flow

```text
Client Request
      ↓
Route
      ↓
Validator
      ↓
validate.middleware.js
      ↓
Controller
      ↓
Service
      ↓
Repository
      ↓
PostgreSQL
```

Important POST endpoints covered by validation:

```text
POST /api/ai/chat
POST /api/recommendations
POST /api/eligibility
```

This prevents invalid request data from unnecessarily reaching the service and repository layers.

---

## 17. Current Backend Folder Structure

The current backend follows a layered architecture:

```text
src/
├── config/
│   ├── db.js
│   └── env.js
│
├── controllers/
│   ├── ai.controller.js
│   ├── application.controller.js
│   ├── category.controller.js
│   ├── department.controller.js
│   ├── eligibility.controller.js
│   ├── health.controller.js
│   ├── recommendation.controller.js
│   ├── scheme.controller.js
│   └── search.controller.js
│
├── middleware/
│   ├── error.middleware.js
│   ├── notFound.middleware.js
│   ├── rateLimit.middleware.js
│   └── validate.middleware.js
│
├── repositories/
│   ├── ai.repository.js
│   ├── application.repository.js
│   ├── category.repository.js
│   ├── department.repository.js
│   ├── eligibility.repository.js
│   ├── recommendation.repository.js
│   ├── scheme.repository.js
│   └── search.repository.js
│
├── routes/
│   ├── ai.routes.js
│   ├── application.routes.js
│   ├── category.routes.js
│   ├── department.routes.js
│   ├── eligibility.routes.js
│   ├── health.routes.js
│   ├── recommendation.routes.js
│   ├── scheme.routes.js
│   ├── search.routes.js
│   └── stats.routes.js
│
├── services/
│   ├── ai.service.js
│   ├── category.service.js
│   ├── department.service.js
│   ├── eligibility.service.js
│   ├── health.service.js
│   ├── query.service.js
│   ├── recommendation.service.js
│   ├── scheme.service.js
│   └── search.service.js
│
├── validators/
│   ├── ai.validator.js
│   ├── eligibility.validator.js
│   └── recommendation.validator.js
│
├── app.js
├── server.js
├── test-ai.js
└── test-search.js
```

### Layer responsibility

```text
Routes
  ↓
Middleware / Validation
  ↓
Controllers
  ↓
Services
  ↓
Repositories
  ↓
PostgreSQL
```

## 18. PostgreSQL Commands {#16-postgresql-commands}

``` bash
psql -U postgres -d hamara_adhikar
```

``` sql
\dt
\d schemes
\d scheme_content
\d eligibility_rules

SELECT * FROM schemes;
SELECT * FROM eligibility_rules;

SELECT
    scheme_id,
    application_process,
    documents_required,
    official_source
FROM scheme_content;
```

## 19. Running {#17-running}

``` bash
npm install
npm run dev
```

Expected:

``` text
PostgreSQL connected successfully
Server running on port 5000
```

Local backend:

``` text
http://localhost:5000
```

## 20. Postman Testing Order {#18-postman-testing-order}

``` text
1. GET  /api/health
2. GET  /api/schemes
3. GET  /api/schemes/:id
4. GET  /api/schemes/random
5. GET  /api/search?q=student
6. POST /api/ai/chat
7. POST /api/recommendations
8. POST /api/eligibility
9. GET  /api/schemes/:id/application
10. GET /api/stats
11. GET /api/states
```

For eligibility test both valid and invalid users.

## 21. Current Completion Status {#19-current-completion-status}

``` text
[✓] PostgreSQL connection
[✓] GET /api/health

[✓] GET /api/schemes
[✓] GET /api/schemes/:id
[✓] GET /api/schemes/code/:code
[✓] GET /api/schemes/random

[✓] GET /api/categories
[✓] GET /api/categories/:category

[✓] GET /api/departments
[✓] GET /api/departments/:department

[✓] GET /api/search
[✓] GET /api/search/suggestions

[✓] POST /api/ai/chat
[✓] PostgreSQL-based AI retrieval
[✓] Natural-language student/Bihar handling

[✓] POST /api/recommendations

[✓] eligibility_rules
[✓] Eligibility repository
[✓] Eligibility service
[✓] Eligibility controller
[✓] POST /api/eligibility
[✓] Eligible response
[✓] Not eligible response
[✓] Multiple eligibility reasons

[✓] Application repository
[✓] Application controller
[✓] Application route
[✓] GET /api/schemes/:id/application
[✓] Application process
[✓] Required documents
[✓] Official source

[✓] GET /api/stats

[✓] Validation middleware
[✓] Rate limiting middleware
[✓] 404 middleware
[✓] Centralized error handling

[ ] GET /api/states
```

## 22. Recommended Next Development Phase {#20-recommended-next-development-phase}

Do not add unnecessary database tables.

Next:

``` text
1. Implement GET /api/states
2. Integrate frontend with all current APIs
3. Add/verify request validation
4. Test complete AI → recommendation → eligibility → application flow
5. Test error cases
6. Add production security checks
7. Document API response contracts
```

The current database is already sufficient for the core product:

``` text
schemes
    = scheme identity

scheme_content
    = detailed scheme + application information

eligibility_rules
    = eligibility logic

AI/Search
    = scheme discovery

Recommendation API
    = relevant scheme recommendation

Eligibility API
    = actual eligibility calculation

Application API
    = application guidance

Random API
    = random scheme discovery

Stats API
    = aggregate database metrics
```

Avoid creating a new table unless the product needs to persist new
information such as user accounts, eligibility history, saved schemes,
application tracking, analytics or audit history.
