# Backend Authentication System

A simple **Node.js + Express backend project** that implements **user registration and login functionality** with **MongoDB** and **password hashing using bcrypt**.
The project also uses **EJS for views** and follows a basic **MVC-style folder structure**.

---

## 🚀 Features

* User Registration
* User Login
* Password Hashing with **bcrypt**
* MongoDB Database using **Mongoose**
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
* MongoDB
* Mongoose
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
MONGO_URI=mongodb://127.0.0.1:27017/backendDB
```

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
