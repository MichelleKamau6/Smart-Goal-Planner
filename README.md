# 🧠 SMART Goal Planner

The **SMART Goal Planner** is a personal finance web application built using HTML, CSS, and JavaScript. It allows users to manage multiple savings goals, track progress, and make deposits — with full CRUD functionality backed by a local JSON Server.

---

## 🚀 Features

- **Create, View, Update, and Delete** savings goals
- Track savings **progress** toward a target amount
- Make **deposits** to any goal
- View a full **overview**: goals completed, money saved, deadlines
- **Warnings** for goals approaching deadlines or overdue

---

## 📁 Project Structure

```plaintext
smart-goal-planner/
│
├── index.html             # Main HTML file
├── style.css              # CSS styling
├── script.js              # Main JavaScript logic
├── db.json                # JSON Server data store
└── README.md              # You're here!
```

---

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: [JSON Server](https://github.com/typicode/json-server) (local REST API)

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/smart-goal-planner.git
cd smart-goal-planner
```

### 2. Install JSON Server (if not installed)

```bash
npm install -g json-server
```

### 3. Run the JSON Server

```bash
json-server --watch db.json
```

> 🟢 The server will run on `http://localhost:3000`

### 4. Open the application

Open `index.html` in your browser (or use a Live Server extension if you're using VS Code).

---

## 📊 JSON Server Data Structure

Here's how `db.json` is structured:

```json
{
  "goals": [
    {
      "id": "1",
      "name": "Travel Fund - Japan",
      "targetAmount": 5000,
      "savedAmount": 3200,
      "category": "Travel",
      "deadline": "2025-12-31",
      "createdAt": "2024-01-15"
    }
  ]
}
```

---

## 📌 Core Functionalities

### 📝 Create a New Goal

Users can input:
- Goal name
- Target amount
- Deadline
- Category

Saves via a `POST` request to the JSON Server.

---

### 💰 Make Deposits

- Choose a goal
- Enter deposit amount
- Updates the `savedAmount` using a `PATCH` request

---

### 📈 Progress & Overview

Displays:
- Visual progress bar per goal
- Remaining amount to save
- Days remaining until deadline
- Warnings for:
  - Deadlines within 30 days
  - Missed/Overdue goals



## 📜 License

MIT License. Free to use, modify, and share.

---

## Author 
Michelle Kamau
[GitHub Profile](https://github.com/MichelleKamau6)
