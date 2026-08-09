# Hamara Adhikar — Backend API

Backend service for **Hamara Adhikar**, an AI-assisted government-scheme discovery and eligibility platform.

The backend is responsible for:

- Government scheme retrieval
- Search and suggestions
- Category and department filtering
- AI-based natural-language scheme discovery
- Scheme recommendations
- Eligibility checking
- Eligibility reasons and next steps
- Application information
- Required documents
- Official source/application links

> This README describes the backend flow and structure based on the current implementation, database structure, API testing, and the working endpoints in the project.

---

## 1. Overall System Flow

The main user journey is:

```text
User
  |
  | Natural-language question
  v
POST /api/ai/chat
  |
  v
PostgreSQL scheme search
  |
  v
Relevant schemes
  |
  v
Gemini AI explanation
  |
  v
User sees recommended/relevant schemes
  |
  | User selects a scheme
  v
POST /api/eligibility
  |
  v
Eligibility Controller
  |
  v
Eligibility Service
  |
  v
eligibility_rules table
  |
  v
Eligibility Result
  |
  +----------------------+
  |                      |
  v                      v
Eligible              Not Eligible
  |                      |
  |                      +--> reasons
  |                      |
  +--> next step         +--> explore other schemes
  |
  v
GET /api/schemes/:id/application
  |
  v
scheme_content
  |
  +--> application process
  +--> required documents
  +--> official source
  +--> apply link / status link
```

---

# 2. Backend Architecture

The backend follows a layered architecture:

```text
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

For AI:

```text
AI Route
  ↓
AI Controller
  ↓
AI Service
  ↓
AI Repository
  ↓
PostgreSQL
  ↓
Relevant schemes
  ↓
Gemini
  ↓
AI response
```

For eligibility:

```text
Eligibility Route
  ↓
Eligibility Controller
  ↓
Eligibility Service
  ↓
Eligibility Repository
  ↓
eligibility_rules
  ↓
Eligibility Result
```

For application information:

```text
Application Route
  ↓
Application Controller
  ↓
Application Repository
  ↓
scheme_content
  ↓
Application Information
```

---

# 3. Project Structure

Current backend structure:

```text
hamara-adhikar-backend/
│
├── src/
│   │
│   ├── config/
│   │   ├── db.js
│   │   └── env.js
│   │
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
│   │
│   ├── repositories/
│   │   ├── ai.repository.js
│   │   ├── application.repository.js
│   │   ├── category.repository.js
│   │   ├── department.repository.js
│   │   ├── eligibility.repository.js
│   │   ├── recommendation.repository.js
│   │   ├── scheme.repository.js
│   │   └── search.repository.js
│   │
│   ├── routes/
│   │   ├── ai.routes.js
│   │   ├── application.routes.js
│   │   ├── category.routes.js
│   │   ├── department.routes.js
│   │   ├── eligibility.routes.js
│   │   ├── health.routes.js
│   │   ├── recommendation.routes.js
│   │   ├── scheme.routes.js
│   │   └── search.routes.js
│   │
│   ├── services/
│   │   ├── ai.service.js
│   │   ├── application.service.js
│   │   ├── category.service.js
│   │   ├── department.service.js
│   │   ├── eligibility.service.js
│   │   ├── health.service.js
│   │   ├── recommendation.service.js
│   │   ├── scheme.service.js
│   │   └── search.service.js
│   │
│   ├── validators/
│   │
│   ├── middleware/
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── package.json
├── package-lock.json
└── README.md
```

### Responsibility of each layer

| Layer | Responsibility |
|---|---|
| Routes | Define HTTP endpoints |
| Controllers | Receive request and send response |
| Services | Business logic |
| Repositories | PostgreSQL queries |
| Config | Database/environment configuration |
| Middleware | Shared request/response handling |
| Validators | Request validation |
| `app.js` | Express application configuration |
| `server.js` | Starts the server |

---

# 4. Database Structure

The current database contains these main tables:

```text
schemes
   |
   +---- scheme_categories
   |
   +---- scheme_tags
   |
   +---- scheme_content
   |
   +---- eligibility_rules
```

## 4.1 `schemes`

Core scheme information.

Important fields:

```text
id
scheme_code
scheme_name
department
state
description
```

This table answers:

> "What is this scheme?"

---

## 4.2 `scheme_content`

Additional structured information about a scheme.

Current structure includes:

```text
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

This table answers:

> "What does the scheme provide and how can the user use/apply for it?"

Important JSONB fields:

```text
application_process
documents_required
official_source
```

Example application data already present:

```json
{
  "mode": "Online / Offline",
  "application_steps": [
    {
      "step": 1,
      "title": "Login",
      "description": "Log in using the User ID and password."
    },
    {
      "step": 2,
      "title": "Enter Details",
      "description": "Fill in personal, educational and other required details."
    }
  ]
}
```

Required documents are also stored here.

Therefore, **a separate `scheme_applications` table is not currently required** just to expose application information.

---

## 4.3 `eligibility_rules`

This table stores the machine-readable eligibility criteria.

Current fields:

```text
id
scheme_id
min_age
max_age
gender
state
occupation
caste
income_limit
disability
```

Example:

```text
scheme_id       = 1
min_age         = 18
max_age         = 35
gender          = Female
state           = {Bihar}
occupation      = {Student}
caste           = {General,OBC,SC,ST}
income_limit    = 300000
disability      = false
```

This table answers:

> "Is this particular user eligible for this scheme?"

---

# 5. Why We Do NOT Need `eligibility_reports` Yet

The current eligibility system calculates the result dynamically:

```text
User data
   ↓
eligibility_rules
   ↓
Eligibility calculation
   ↓
eligible / not eligible
   ↓
reasons
```

Example:

```json
{
  "eligible": false,
  "message": "You are not eligible for this scheme.",
  "reasons": [
    "Age criteria not satisfied",
    "Gender criteria not satisfied",
    "State criteria not satisfied"
  ]
}
```

There is no need to save every eligibility check in PostgreSQL unless the product later requires:

- User accounts
- Eligibility history
- Saved schemes
- Application tracking
- Analytics
- Admin reports
- Audit history

For the current product, returning the calculated result is simpler and avoids unnecessary database writes.

---

# 6. API Endpoints

Base URL during local development:

```text
http://localhost:5000
```

---

## 6.1 Health

### GET

```text
GET /api/health
```

Purpose:

Check whether the backend is running.

---

# 7. Scheme APIs

## Get all schemes

```text
GET /api/schemes
```

Purpose:

Return available government schemes.

---

## Get scheme by ID

```text
GET /api/schemes/:id
```

Example:

```text
GET /api/schemes/29
```

Purpose:

Return details of one scheme.

---

# 8. Search APIs

## Search schemes

```text
GET /api/search?q=student
```

Purpose:

Search schemes using keywords.

Example:

```text
GET /api/search?q=student
```

The backend can use PostgreSQL full-text search and keyword matching.

---

## Search suggestions

```text
GET /api/search/suggestions?q=student
```

Purpose:

Provide search suggestions/autocomplete.

---

# 9. Category APIs

## Get categories

```text
GET /api/categories
```

## Get schemes by category

```text
GET /api/categories/:category
```

Example:

```text
GET /api/categories/Education
```

---

# 10. Department APIs

## Get departments

```text
GET /api/departments
```

## Get schemes by department

```text
GET /api/departments/:department
```

---

# 11. AI Chat API

## Endpoint

```text
POST /api/ai/chat
```

### Request

```json
{
  "message": "I am a student from Bihar. Which schemes are suitable for me?"
}
```

The AI flow is:

```text
User question
    ↓
ai.controller
    ↓
ai.service
    ↓
ai.repository.searchSchemes()
    ↓
PostgreSQL
    ↓
Top matching schemes
    ↓
Gemini
    ↓
Natural-language response
```

The AI should not invent schemes.

It receives database results as context and is instructed to answer using those results.

---

# 12. Natural Language Search

The system should understand queries such as:

```text
I am a student from Bihar
```

and:

```text
I am a postgraduate student from Bihar
```

and:

```text
I am a 22-year-old female student from Bihar, General category. Which schemes am I eligible for?
```

The important concept is:

```text
Normal user language
        ↓
Extract intent/important attributes
        ↓
Search schemes
        ↓
Return relevant schemes
```

For example:

```text
"I am a student from Bihar"
```

should be interpreted approximately as:

```text
state = Bihar
occupation = Student
education/student intent = true
```

---

# 13. Recommendation API

Current endpoint:

```text
POST /api/recommendations
```

Purpose:

Return schemes that are relevant to the user's profile/requirements.

Recommended flow:

```text
User profile
   ↓
Recommendation API
   ↓
Relevant schemes
   ↓
User selects a scheme
   ↓
Eligibility API
```

The recommendation step should not be treated as final eligibility.

It answers:

> "Which schemes may be relevant to me?"

Eligibility answers:

> "Am I actually eligible for this selected scheme?"

---

# 14. Eligibility API

## Endpoint

```text
POST /api/eligibility
```

### Request example

```json
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

---

## Eligibility processing

```text
POST /api/eligibility
        ↓
eligibility.controller.js
        ↓
eligibility.service.js
        ↓
eligibility.repository.js
        ↓
eligibility_rules
        ↓
Compare every criterion
        ↓
eligible = true / false
        ↓
reasons[]
```

The current service checks:

- Age
- Gender
- State
- Occupation
- Income
- Caste
- Disability

---

## Eligible response

Example:

```json
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

---

## Not eligible response

Example:

```json
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

The backend correctly returns multiple failed criteria rather than stopping after the first failure.

---

# 15. Application Information API

## Endpoint

```text
GET /api/schemes/:id/application
```

Example:

```text
GET /api/schemes/1/application
```

The application endpoint reads existing application information from:

```text
scheme_content
```

It does not require a new application database table at this stage.

---

## Application flow

```text
User is eligible
       ↓
Show scheme information
       ↓
GET /api/schemes/:id/application
       ↓
scheme_content
       ↓
Application process
       ↓
Required documents
       ↓
Official source
       ↓
Apply Now
```

The response can expose:

```text
application_process
documents_required
official_source
```

The `official_source` JSON currently contains fields such as:

```text
email
website
helpline
apply_link
status_link
download_link
```

---

# 16. Complete User Journey

This is the complete backend product flow:

```text
                         USER
                           |
                           v
              "I am a student from Bihar"
                           |
                           v
                   AI / SEARCH
                           |
              +------------+------------+
              |                         |
              v                         v
        /api/ai/chat              /api/search
              |                         |
              +------------+------------+
                           |
                           v
                  Relevant Schemes
                           |
                           v
                /api/recommendations
                           |
                           v
                 Recommended Schemes
                           |
                           v
                  USER SELECTS SCHEME
                           |
                           v
                 /api/eligibility
                           |
                           v
                 eligibility_rules
                           |
              +------------+------------+
              |                         |
              v                         v
          ELIGIBLE                 NOT ELIGIBLE
              |                         |
              v                         v
      Show success message        Show reasons
              |                         |
              v                         v
      Application information     Explore other schemes
              |
              v
 GET /api/schemes/:id/application
              |
              v
        scheme_content
              |
       +------+------+------+
       |      |      |      |
       v      v      v      v
     Steps  Docs   Apply  Status
```

---

# 17. Postman Testing Order

When testing the backend, use this order.

### Step 1 — Health

```text
GET /api/health
```

Expected:

```text
200 OK
```

---

### Step 2 — Get schemes

```text
GET /api/schemes
```

---

### Step 3 — Search

```text
GET /api/search?q=student
```

---

### Step 4 — AI

```text
POST /api/ai/chat
```

Body:

```json
{
  "message": "I am a student from Bihar. Which schemes are suitable for me?"
}
```

---

### Step 5 — Recommendation

```text
POST /api/recommendations
```

Use the request body expected by the current recommendation controller.

---

### Step 6 — Eligibility

```text
POST /api/eligibility
```

Example:

```json
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

---

### Step 7 — Application information

Only after selecting a scheme:

```text
GET /api/schemes/1/application
```

---

# 18. PostgreSQL Useful Commands

Connect to the database:

```bash
psql -U postgres -d hamara_adhikar
```

If peer authentication blocks the command, connect using the PostgreSQL role/configuration already used by your project instead of creating another database unnecessarily.

List tables:

```sql
\dt
```

Check scheme structure:

```sql
\d schemes
```

Check scheme content:

```sql
\d scheme_content
```

Check eligibility rules:

```sql
\d eligibility_rules
```

View eligibility rules:

```sql
SELECT * FROM eligibility_rules;
```

View schemes:

```sql
SELECT * FROM schemes;
```

View application information:

```sql
SELECT
    scheme_id,
    application_process,
    documents_required,
    official_source
FROM scheme_content;
```

---

# 19. Running the Backend

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Expected:

```text
PostgreSQL connected successfully
Server running on port 5000
```

Backend:

```text
http://localhost:5000
```

---

# 20. Environment Variables

Keep secrets in `.env`.

Example structure:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=hamara_adhikar
DB_USER=postgres
DB_PASSWORD=your_password

GEMINI_API_KEY=your_gemini_api_key
```

Do not commit real API keys or database passwords.

`.env` should remain in `.gitignore`.

---

# 21. Error Handling

Common errors:

### Eligibility rules not found

```json
{
  "success": false,
  "message": "Eligibility rules not found"
}
```

Check:

```sql
SELECT * FROM eligibility_rules
WHERE scheme_id = 1;
```

There must be an eligibility rule for the selected scheme.

---

### Scheme not found

Verify:

```sql
SELECT *
FROM schemes
WHERE id = 1;
```

---

### Application data missing

Check:

```sql
SELECT *
FROM scheme_content
WHERE scheme_id = 1;
```

Make sure the application-related JSONB fields contain data.

---

# 22. Important Design Decision

The backend currently separates:

### Scheme discovery

```text
schemes
scheme_content
search
AI
recommendations
```

from:

### Eligibility calculation

```text
eligibility_rules
eligibility service
```

and:

### Application guidance

```text
scheme_content
application API
```

This is a good separation because each table has a clear responsibility.

---

# 23. What Happens After Eligibility?

If the user is eligible:

```text
Eligible
   ↓
Show scheme details
   ↓
Show benefits
   ↓
Show application process
   ↓
Show required documents
   ↓
Show official portal
   ↓
Apply Now
```

If the user is not eligible:

```text
Not Eligible
   ↓
Show exact reasons
   ↓
Explain failed criteria
   ↓
Suggest exploring other schemes
   ↓
User can select another scheme
   ↓
Run eligibility again
```

---

# 24. Current Backend Completion Status

Based on the current implementation:

```text
[✓] PostgreSQL connection
[✓] Schemes API
[✓] Scheme details API
[✓] Category APIs
[✓] Department APIs
[✓] Search API
[✓] Search suggestions
[✓] AI chat
[✓] PostgreSQL-based AI scheme retrieval
[✓] Natural-language student/Bihar search handling
[✓] Recommendation endpoint
[✓] eligibility_rules table
[✓] Eligibility repository
[✓] Eligibility service
[✓] Eligibility controller
[✓] POST /api/eligibility
[✓] Eligible response
[✓] Not eligible response
[✓] Multiple eligibility reasons
[✓] Application repository
[✓] Application controller
[✓] Application routes
[✓] GET /api/schemes/:id/application
[✓] Application process data
[✓] Required documents data
[✓] Official source data
```

---

# 25. Recommended Next Development Phase

Do not immediately add more database tables.

The next priority should be **integration and production readiness**:

### Phase 1 — Backend integration

```text
AI
 ↓
Recommendation
 ↓
Eligibility
 ↓
Application information
```

Make sure the IDs and response formats connect correctly.

### Phase 2 — Validation

Add validation for:

```text
schemeId
age
gender
state
occupation
income
caste
disability
```

### Phase 3 — Error handling

Standardize:

```json
{
  "success": false,
  "message": "Readable error message"
}
```

### Phase 4 — Security

Add:

```text
Input validation
Rate limiting
CORS configuration
Environment secrets
SQL parameterization
Request size limits
```

### Phase 5 — Testing

Test:

```text
Valid eligibility
Invalid eligibility
Missing eligibility rule
Invalid scheme ID
Missing application information
Empty search
AI with normal language
AI with irrelevant questions
```

### Phase 6 — Frontend integration

Frontend should consume:

```text
/api/ai/chat
/api/recommendations
/api/eligibility
/api/schemes/:id/application
```

---

# 26. Final Architecture

The final backend concept is:

```text
                    HAMARA ADHIKAR
                           |
                           v
                    User Question
                           |
             +-------------+-------------+
             |                           |
             v                           v
         Search                       AI Chat
             |                           |
             +-------------+-------------+
                           |
                           v
                    Scheme Results
                           |
                           v
                    Recommendations
                           |
                           v
                    User Selects
                       Scheme
                           |
                           v
                    Eligibility API
                           |
                    eligibility_rules
                           |
             +-------------+-------------+
             |                           |
             v                           v
          Eligible                  Not Eligible
             |                           |
             v                           v
      Application API             Reasons shown
             |
             v
       scheme_content
             |
      +------+------+------+
      |      |      |      |
      v      v      v      v
    Steps  Docs  Apply   Status
```

---

## Backend principle

Keep the system simple:

```text
schemes
    = scheme identity/basic information

scheme_content
    = detailed scheme + application information

eligibility_rules
    = eligibility logic/data

AI/Search
    = find relevant schemes

Eligibility API
    = calculate eligibility

Application API
    = tell the user how to apply
```

Avoid creating a new table unless the product actually needs to **persist new information**. For example, an `eligibility_reports` table is unnecessary for the current stateless eligibility-check flow.
