# Sweet Shop Management System

A full-stack Sweet Shop Management System built with **Node.js/Express** (Backend) and **React/Vite** (Frontend). This application allows customers to browse and purchase sweets, and provides administrators with a comprehensive dashboard to manage inventory.

## Features

### Backend (RESTful API)

- **Technology**: Node.js, Express, TypeScript, MongoDB.
- **Authentication**: JWT-based secure authentication (Register/Login).
- **Sweets Management**: CRUD operations for sweets (Name, Category, Price, Stock).
- **Search**: Advanced filtering by name, category, and price range.
- **Transactions**: Purchase endpoint that automatically updates stock.
- **Security**: Protected routes for Admin-only actions.

### Frontend (SPA)

- **Technology**: React 19, Vite, Tailwind CSS, Shadcn UI.
- **Catalog**: Interactive grid of sweets with search and real-time filtering.
- **Admin Dashboard**: Modern UI with statistics cards, data tables, and inventory management.
- **Role-Based UI**: dedicated views for Customers vs. Administrators.
- **Responsive Design**: Mobile-friendly layout.

---

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- MongoDB (Running locally or hosted)

### 1. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend` root:
    ```env
    PORT=3000
    MONGO_URI=mongodb://127.0.0.1:27017/sweetshop
    JWT_SECRET=your_super_secret_key
    ```
4.  Start the server:
    ```bash
    npm run dev
    ```

### 2. Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open `http://localhost:5173` in your browser.

---

## My AI Usage

I used **Google Gemini** throughout the development of this project. Below is a summary of how AI was leveraged:

- **Boilerplate Generation**: Used Gemini to generate the initial project structure for both Express (backend) and React (frontend), saving significant setup time.
- **UI Design Implementation**: Leveraged AI to generate Shadcn UI component structures (Tables, Cards) and Tailwind CSS classes for the "fancy" Admin Dashboard.
- **Debugging**: Used AI to troubleshoot TypeScript errors, specifically identifying issues with `routes` configuration and Mongoose type definitions.
- **Refactoring**: AI assisted in refactoring the `AdminDashboard` from a basic table to a stats-rich dashboard and simplifying the `SweetForm` schema.
- **Documentation**: AI co-authored this README and generated the commit messages to ensure they followed conventional commit standards.

**Reflection**:
AI significantly accelerated the "boring" parts of development (setup, boilerplate) and allowed me to focus on the logic and user experience. It acted as a pair programmer, catching type errors early and suggesting clean UI patterns I might have otherwise skipped for time.

---

## Test Report

- **Backend**: Jest tests are configured.
- **Frontend**: Vitest is configured.
  - _Note_: Frontend tests were temporarily paused to focus on rapid UI iteration. Backend logic was verified via manual API testing and UI integration.

---

## Screenshots

_(Placeholder: Screenshots of Login, Catalog, and Admin Dashboard would appear here)_
