# 💰 Expense Tracker

> **Manage your finances with style and precision.**

Run your life like a pro with this full-featured **Expense Tracker**, built on the robust **MERN Stack** (MongoDB, Express, React, Node.js). Track income, monitor expenses, set monthly budgets, and visualize your financial health with dynamic charts.

---

## ✨ Features

-   **📊 Dynamic Dashboard**: Real-time overview of your total balance, income, and expenses. Includes visual charts to break down spending by category.
-   **💸 Transaction Management**: Easily add, edit, and delete income and expense transactions. Filter by date, category, or type.
-   **🎯 Budgeting**: Set monthly budgets and track your progress. Get visual alerts when you're nearing your limit.
-   **🔐 Secure Authentication**: Full user registration and login system protected with JWT (JSON Web Tokens).
-   **📱 Responsive Design**: Built with a mobile-first approach using modern CSS and React icons.

## 🛠️ Tech Stack

-   **Frontend**: React (Vite), Chart.js, React Router
-   **Backend**: Node.js, Express.js
-   **Database**: MongoDB (Mongoose)
-   **Authentication**: JWT, bcryptjs

## 🚀 Getting Started

### Prerequisites

-   Node.js (v14+)
-   MongoDB (Local or Atlas)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/x03tanuj/tracker.git
    cd tracker
    ```

2.  **Install Dependencies**
    ```bash
    # Install backend dependencies
    cd backend
    npm install

    # Install frontend dependencies
    cd ../frontend
    npm install
    ```

3.  **Environment Setup**
    -   Create `.env` in `backend/` with:
        ```env
        PORT=8080
        MONGODB_URI=your_mongodb_uri
        JWT_SECRET=your_secret_key
        ```
    -   Create `.env` in `frontend/` with:
        ```env
        VITE_API_URL=http://localhost:8080/api
        ```

4.  **Run the App**
    ```bash
    # Run Backend (from backend dir)
    npm start

    # Run Frontend (from frontend dir)
    npm run dev
    ```

---

Made with ❤️ by [Swasti](https://github.com/x03tanuj)
