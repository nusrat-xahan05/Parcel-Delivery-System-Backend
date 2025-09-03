# 📦 Parcel Delivery Management System API (ParcelRunner)

A robust RESTful Parcel Delivery System API built with **Express.js**, **MongoDB**, and **TypeScript**, enabling a secure, modular and role-based operations.

---

## 📌 Project Overview

This system streamlines parcel delivery logistics with four roles: **Admin**, **Sender**, **Receiver**, and **Agent**. It includes features like create parcel, cancel parcel, parcel tracking, role-based permissions, delivery history, and many more.

---

### 🚀 Features
- **User Authentication & OTP Verification**
  - Login, logout, register, send and verify OTP
- **User Management**
  - Role-based access: Admin, Sender, Agent, Receiver
  - Agent requests and approvals
  - Admin can do agent review, user and parcel blocking functionality, manage all parcels and users
- **Parcel Management**
  - Create, update, cancel, and track parcels
  - Parcel assignment to agents
  - Delivery status updates
  - Parcel view history, delivery confirmation and incoming parcels for users
- **Analytics & Stats**
  - Dashboard data for Admin
  - Parcel counts by status, type, service, and delivery
  - Monthly shipment summaries
  - User statistics

---

## 🛠 Tech Stack

- **Backend**: Express.js, TypeScript, Node.js
- **Database**: MongoDB with Mongoose
- **Validation**: Zod
- **Verification**: Nodemailer, Redis
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
git clone https://github.com/nusrat-xahan05/Parcel-Delivery-System-Backend.git
cd Parcel-Delivery-System-Backend
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
- POST `/logout` – Logout user

---

### 📥 Otp (`/api/v1/otp`)
- POST `/send` – Send OTP Code to an Email
- POST `/verify` – Verify the OTP

---

### 🙋 User (`/api/v1/user`)
- POST `/register` – Register a new user (public)
- POST `/agent-request` – Request to become an agent (sender/receiver)
- GET `/me` – Get logged-in user to view self profile
- GET `/all-users` – Get all users (admin)
- GET `/agent-requests` – View all agent requests (admin)
- GET `/:id` – Get a single user (admin)
- PATCH `/:id` – Update user info / block by admin (admin, sender, receiver, agent)
- POST `/review-agent-request/:id` – Approve or reject agent request (admin)

---

### 📦 Parcel (`/api/v1/parcel`)
- POST `/create-parcel` – Create a new parcel (sender, admin)
- GET `/me` – Get parcels Created By Own (sender, admin)
- GET `/all-parcels` – View all parcels (admin)
- GET `/assigned-parcels` – View all Assigned parcels (agent)
- GET `/incoming` – Get incoming parcels list (receiver)
- GET `/history` – Get delivery history (receiver)
- GET `/:id` – Get a single parcel details (admin, sender, receiver)
- PATCH `/:id` – Approve or block parcel and assign agent (admin)
- PATCH `status-update/:id` – Update delivery status (agent)
- PATCH `/:id/cancel` – Cancel a parcel (sender, admin)
- PATCH `/:id/confirm-delivery` – Confirm parcel delivery (receiver)
- GET `/track-parcel/:id` – Track parcel using tracking ID (public)

---

### 📊 Stats (`/api/v1/stats`)
- GET `/user` – Get user statistics (admin)
- GET `/parcel` – Get parcel statistics (admin)

---

## 🧪 Testing

Use **Postman** to test the endpoints. Ensure your `.env` file is properly configured with all required secrets and DB credentials.

---
