# 📦 Parcel Delivery Management System API (ParcelRunner)

A robust RESTful Parcel Delivery System API built with **Express.js**, **MongoDB**, and **TypeScript**, enabling a secure, modular and role-based operations.

---

## 📌 Project Overview

This system streamlines parcel delivery logistics with four roles: **Admin**, **Sender**, **Receiver**, and **Agent**. It includes features like create parcel, cancel parcel, parcel tracking, role-based permissions, delivery history, and many more.

---

## 🚀 Features

- User registration & login with role based.
- Agent request and approval system
- Role-specific dashboards (Sender, Receiver, Admin, Agent)
- Admin can do agent review, user and parcel blocking functionality, manage all parcels and users
- Parcel creation, view incoming parcel and history, status tracking, cancellation, and delivery confirmation
- Public parcel tracking by tracking ID

---

## 🛠 Tech Stack

- **Backend**: Express.js, TypeScript, Node.js
- **Database**: MongoDB with Mongoose
- **Validation**: Zod
- **Auth**: JWT (Access + Refresh Tokens)
- **Deployment**: Render

---

## ⚙️ Setup & Environment Instructions

### 🔧 Prerequisites

- Node.js (v18+ recommended)
- MongoDB Atlas or Local MongoDB
- Postman (for API testing)

### 📥 Installation

1. Clone the repository:
```
git clone https://github.com/nusrat-xahan05/ParcelRunner-System-Backend.git
cd ParcelRunner-System-Backend
npm install
```

2. Create a `.env` file in the root and add the following:

```env
PORT = 5000
DB_URL = your_mongodb_connection_string
NODE_ENV = Development
BCRYPT_SALT_ROUND = your_desired_round_number
ADMIN_EMAIL = provide_email
ADMIN_PASSWORD = provide_password
ADMIN_PHONE = provide_phone_number
JWT_ACCESS_SECRET = your_jwt_access_secret
JWT_ACCESS_EXPIRES = -d
JWT_REFRESH_SECRET = your_jwt_refresh_secret
JWT_REFRESH_EXPIRES = --d
```

4. Run in development mode:
```bash
npm run dev
```

5. Build & start production server:
```bash
npm run build
npm start
```

## 📮 API Endpoints

### 👤 Auth (`/api/v1/auth`)
- POST `/login` – Login with credentials
- POST `/refresh-token` – Get a new access token
- POST `/logout` – Logout user
- POST `/reset-password` – Reset user password

---

### 🙋 User (`/api/v1/user`)
- POST `/register` – Register a new user (sender/receiver)
- POST `/agent-request` – Request to become an agent (sender/receiver)
- GET `/me` – Get logged-in user profile
- PATCH `/:id` – Update user info / block by admin
- GET `/:id` – Get a single user (admin only)
- GET `/all-users` – Get all users (admin only)
- GET `/agent-request` – View all agent requests (admin only)
- POST `/review-agent-request/:id` – Approve or reject agent request (admin only)

---

### 📦 Parcel (`/api/v1/parcel`)
- POST `/create-parcel` – Create a new parcel (sender/admin)
- GET `/all-parcels` – View all parcels (admin only)
- GET `/me` – Get sender's own parcels
- GET `/incoming` – Get incoming parcels (receiver)
- GET `/history` – Get delivery history (receiver)
- GET `/track/:id` – Track parcel using tracking ID (public)
- GET `/:id` – Get a single parcel (admin only)
- PATCH `/manage/:id` – Approve or block parcel and assign agent (admin only)
- PATCH `/status-update/:id` – Update parcel status (agent only)
- PATCH `/cancel/:id` – Cancel a parcel (sender/admin)
- PATCH `/confirm-delivery/:id` – Confirm parcel delivery (receiver only)

---

## 🧪 Testing

Use **Postman** to test the endpoints. Ensure your `.env` file is properly configured with all required secrets and DB credentials.

---
