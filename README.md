# Sweet Shop Management System

A full-stack Sweet Shop Management System built with Node.js, Express, TypeScript, and modern frontend technologies.

## Project Structure

- `backend/`: Node.js/Express API with TypeScript
- `frontend/`: (Upcoming) React/Vue/Svelte Single Page Application

## Completed Setup

### Backend

- **Framework**: Node.js with Express
- **Language**: TypeScript
- **Database Logic**: Mongoose (MongoDB) - `User` and `Sweet` models implemented
- **Testing**: Jest with `supertest` and `ts-jest`
- **Configuration**:
  - Native Node.js `.env` support
  - Native Node.js `--watch` mode for development
- **Code Quality**: ESLint configured

## Getting Started

### Backend

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file (if not present) with the following content:

   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/sweets_shop
   JWT_SECRET=supersecretkey
   NODE_ENV=development
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Run tests:
   ```bash
   npm test
   ```

## My AI Usage

### Tools Used

- **Google Gemini**: Co-authored initial boilerplate code, test cases, and configuration files.

### Usage Description

- Used Gemini to generate the initial `package.json` scripts using native Node.js 20.6+ features (`--env-file`, `--watch`).
- Implemented secure Authentication with JWT and HTTPOnly cookies (Register/Login/Logout).
- Implemented `verifyToken` middleware for route protection.
- Implemented Sweets Management:
  - `POST /api/sweets` (Protected)
  - `GET /api/sweets` (Public)
  - `GET /api/sweets/search` (Public, filters: name, category, price)
  - `PUT /api/sweets/:id` (Admin Only)
  - `DELETE /api/sweets/:id` (Admin Only)
- Implemented `User` and `Sweet` Mongoose models with validation and password hashing.
- Assisted in configuring the MongoDB connection logic.

### Reflection

AI has accelerated the setup process by providing correct configuration for TypeScript and Jest, which can often be tricky to align manually.
