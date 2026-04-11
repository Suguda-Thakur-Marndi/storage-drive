# Backend Authentication System

A simple **Node.js + Express backend project** that implements **user registration and login functionality** with **Supabase** and **password hashing using bcrypt**.
The project also uses **EJS for views** and follows a basic **MVC-style folder structure**.

---

## 🚀 Features

* User Registration
* User Login
* Password Hashing with **bcrypt**
* Supabase database access using the official **Supabase JS** client
* Server logging with **Morgan**
* Environment variables using **dotenv**
* Simple UI using **EJS**

---

## 📁 Project Structure

```
Backend
│
├── app.js
├── package.json
├── .env
│
├── config
│   └── db.js
│
├── models
│   └── user.model.js
│
├── routes
│   ├── index.routes.js
│   └── user.routes.js
│
└── views
    ├── home.ejs
    ├── login.ejs
    └── register.ejs
```

---

## 🛠️ Technologies Used

* Node.js
* Express.js
* Supabase
* @supabase/supabase-js
* bcrypt
* dotenv
* Morgan
* EJS

---

## ⚙️ Installation

Clone the repository

```
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
```

Move into the project directory

```
cd Backend
```

Install dependencies

```
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file in the root folder.

Example:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_STORAGE_BUCKET=user-files
JWT_SECRET=your-jwt-secret
```

Create a Supabase Storage bucket named `user-files` (or set your custom name in `SUPABASE_STORAGE_BUCKET`).

If you already uploaded files to the local `uploads` folder before this change, migrate them once with:

```
npm run migrate:uploads
```

Create a `users` table in Supabase with at least these columns:

* `id` uuid primary key defaulting to `gen_random_uuid()`
* `username` text unique not null
* `email` text unique not null
* `password` text not null

---

## ▶️ Running the Project

Start the server

```
npm start
```

Server will run on

```
http://localhost:3000
```

---

## 📌 Routes

### Register User

```
POST /user/register
```

### Login User

```
POST /user/login
```

### Home Page

```
GET /home
```

---

## 📷 Example Pages

* Register Page
* Login Page
* Home Page

---

## 🔒 Security

* Passwords are hashed using **bcrypt**
* Input validation is done using **express-validator**

---

## 👨‍💻 Author

Suguda
Computer Science Student

---

## 📜 License

This project is open source and free to use.
