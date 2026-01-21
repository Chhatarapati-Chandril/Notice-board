# Notice Board – Technical Documentation

## Tech Stack
### Backend
- Node.js
- Express.js
- Database: MySQL

### Frontend
- JavaScript
- React

---

## Ports & Services
- Backend API: http://localhost:8080
- Frontend App: http://localhost:3000
- API Base Path: /api/v1

---

## Project Structure
- backend/ → Backend service
- frontend/ → Frontend application

All backend code must be written inside `backend/src`  
All frontend code must be written inside `frontend/src`

---

## Environment Rules
- `.env` files must NOT be committed
- Use `backend/.env.example` as reference

---

## Branching Rules
- `main` → structure & final merged code only
- `backend-dev` → backend development
- `frontend-dev` → frontend development

Direct pushes to `main` are not allowed.

---

## Development Notes
- Backend runs independently of frontend
- Frontend consumes backend via REST APIs
- Backend defines API contracts
