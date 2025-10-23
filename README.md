---

🏦 Bank WebApp Using OOP

A banking web application built using Object-Oriented Programming (OOP) principles and MVC architecture, designed to manage accounts, transactions, and financial reports. This project uses JSON Server to simulate a backend database.


---

📸 Sample UI Screenshots
![dashboard](https://github.com/user-attachments/assets/876b737d-6928-4709-81ab-d2f2038895ec)
![mobile1](https://github.com/user-attachments/assets/a1a5d6ad-c946-494d-9a2a-e0e5078e64a4)
![mobile2](https://github.com/user-attachments/assets/c32660b6-33a2-41f1-aaff-a7b7cc0f1c7e)


![transfer](https://github.com/user-attachments/assets/f91679a7-e1a5-4dc4-b9b5-81ff04a5ef0c)
![login](https://github.com/user-attachments/assets/e094faa3-e8c9-41eb-8d66-ac47e70d25ac)


---

📌 Features

Manage bank accounts (create, update, delete)

Record and display deposit and withdrawal transactions

Generate account balances and transaction reports

Modular and maintainable code using MVC architecture

Connects to JSON Server for data persistence



---

⚙️ Prerequisites

Node.js and npm installed

JSON Server installed globally or locally to simulate the backend



---

🚀 Getting Started

1. Clone the repository



git clone https://github.com/amin13m/bank-webapp-using-OOP.git
cd bank-webapp-using-OOP

2. Install dependencies



npm install

3. Start JSON Server



npm run server

This will start a local backend at http://localhost:3000.

4. Open the application



npm start

Then open index.html in your browser, or access the dev server if configured.


---

🛠️ Project Structure

bank-webapp-using-OOP/
├── oop/              # Object-oriented classes (Bank, Account, User, API)
├── charts/           # Chart.js components for dashboards
├── ui/               # UI rendering logic
├── event/            # Event handlers
├── auth/             # Login and account creation logic
├── style/            # CSS styles
├── db.json           # JSON Server backend database
├── index.html        # Main HTML page
├── package.json      # NPM configuration
└── README.md         # Project documentation


---

📄 License

This project is licensed under the MIT License. See LICENSE for details.


---

✅ Notes

The project is designed as a Single Page Application (SPA), but can be extended to multi-page if needed

JSON Server acts as a mock backend; all data is stored in db.json


---
