---

🏦 Bank WebApp Using OOP

A banking web application built using Object-Oriented Programming (OOP) principles and MVC architecture, designed to manage accounts, transactions, and financial reports. This project uses JSON Server to simulate a backend database.


---

📸 Sample UI Screenshots

![dashboard](https://github.com/user-attachments/assets/31a024cc-63ab-4a68-a48f-998edc12b6c6)
![dashboard2](https://github.com/user-attachments/assets/b2f385ac-5e9b-49b1-af7b-0200f33f717a)
![hambergerMenu](https://github.com/user-attachments/assets/66ba2886-230d-4887-9533-28d6c9ad7032)
![login](https://github.com/user-attachments/assets/883f7ccd-a399-4fc9-a178-beaeea1c19cf)
![transactions](https://github.com/user-attachments/assets/898acb79-8157-469e-992e-da0c7a581dfc)
![transfer](https://github.com/user-attachments/assets/d20b0efd-f716-435c-967e-c92493860c27)
![transfer2](https://github.com/user-attachments/assets/e4f6d68d-81f3-4858-ad23-12966baa4c9a)


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
