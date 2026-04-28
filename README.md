# 🩺 Doctor Tracker

## 🚀 Overview

Doctor Tracker is a secure, full-stack administrative web application built with Next.js that allows authenticated users to manage doctors and their corresponding patients. The system focuses on performance optimization, clean user experience, and meaningful data visualization.

---

## ✨ Features

### 🔐 Authentication

* Secure login system using NextAuth (JWT-based)
* Protected routes using middleware
* Role-ready architecture (admin/staff scalable)

---

### 🧑‍⚕️ Doctor Management

* Create doctor
* View doctor list
* Search & filter doctors
* Pagination support
* View patients under each doctor
* Add/Delete patients per doctor

---

### 🧑 Patient Management

* List all patients
* Edit patient information
* Delete patients
* Search & filter
* Pagination support

---

### 📊 Dashboard & Analytics

* Total doctors
* Total patients
* Patients per doctor
* Date-based statistics
* Charts (data visualization)

---

### 🎨 UI/UX

* Modern UI with clean layout
* Responsive design (mobile + desktop)
* Smooth navigation
* Loading, empty & error states handled
* Toast notifications

---

## 🛠 Tech Stack

* **Frontend & Backend:** Next.js (App Router, Full-stack)
* **Database:** MongoDB (Mongoose)
* **Authentication:** NextAuth (JWT strategy)
* **State Management:** React Query
* **UI:** Tailwind CSS + shadcn/ui
* **Validation:** Zod + React Hook Form

---

## ⚙️ Setup Guide

### 1️⃣ Clone Repository

```bash
git clone https://github.com/rifat-mahmudul/doctor-tracker.git
cd doctor-tracker
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Create Environment File

Create a `.env.local` file in the root directory and add:

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_URL=http://localhost:3000/
NEXTAUTH_SECRET=your_nex_auth_secret
ADMIN_EMAIL=admin_email
ADMIN_PASS=admin_password
```

---

### 4️⃣ Run Seed Script (Create Admin User)

This script will create the first admin user in the database.

```bash
npx tsx src/scripts/seedAdmin.ts
```

Expected output:

```bash
Admin created successfully
```

or

```bash
Admin already exists
```

---

### 5️⃣ Run Development Server

```bash
npm run dev
```

App will be available at:

```txt
http://localhost:3000
```

---

## 🔐 Demo Credentials

```txt
Email: rifatmahmudul.dev@gmail.com
Password: admin@!123
```

---

## 🏗 System Architecture

```txt
Frontend (Next.js UI)
        ↓
API Routes (Next.js backend)
        ↓
MongoDB (Mongoose Models)
        ↓
NextAuth (Authentication Layer)
        ↓
Middleware (Route Protection)
```

---

## 🤔 Technical Decisions

### 1. Why JWT-based Authentication (NextAuth)?

JWT allows stateless authentication, reducing database load and improving performance. It also integrates seamlessly with middleware for route protection.

---

### 2. Why React Query instead of Context API?

React Query provides:

* Server state caching
* Background refetching
* Better performance
* Cleaner data fetching patterns

This results in a more scalable and maintainable frontend architecture.

---

## ⚡ Performance Optimizations

* MongoDB indexing for faster queries
* Pagination using `.limit()` and `.skip()`
* Regex-based search optimization
* Cached DB connection
* Avoided unnecessary React re-renders

---

## 📁 Folder Structure (Simplified)

```txt
src/
 ├── app/
 │    ├── api/
 │    ├── dashboard/
 │    ├── doctors/
 │    ├── patients/
 │
 ├── models/
 ├── lib/
 ├── scripts/
 ├── components/
```

---

## 📸 Screenshots

### Authentication
![Login](./screenshots/login.png)

### 🖥 Desktop View
![Dashboard](./screenshots/dashboard.png)

### 📱 Mobile View
![Mobile](./screenshots/mobile.png)

### 🧑‍⚕️ Doctor Management
![Doctors](./screenshots/doctors.png)

### 🧑 Patient Page
![Patients](./screenshots/patients.png)

---

## 🚀 Deployment

You can deploy easily using:

* Vercel (recommended)

---

## 📄 License

This project is for assessment and learning purposes.
