# Kharcha - Expense Tracker 💰

## 1. PROJECT OVERVIEW
Kharcha is a complete, full-stack personal finance and expense tracking application. Designed with a mobile-first philosophy, it functions flawlessly on desktop browsers and mobile devices. It requires no external cloud databases, running entirely locally on your machine for complete data privacy.

| Layer | Technology |
|-------|-----------|
| **Frontend** | Single HTML file, React 18 (CDN), Babel, Chart.js (CDN), Google Fonts |
| **Backend** | Node.js, Express.js |
| **Database** | SQLite3 (`better-sqlite3`) — Local file, no SQL server installation required |
| **Auth** | JWT (JSON Web Tokens) + `bcryptjs` password hashing |

## 2. FOLDER STRUCTURE
```text
kharcha-expense-tracker/
├── backend/
│   ├── auth.js            ← Authentication routes & JWT middleware
│   ├── database.js        ← SQLite database connection & schema setup
│   ├── kharcha.db         ← Local SQLite database (Auto-generated)
│   ├── package.json       ← Backend dependencies
│   ├── server.js          ← Main Express server entry point
│   └── routes/
│       ├── budget.js      ← Budget limits API
│       ├── expenses.js    ← Core expenses CRUD API
│       ├── goals.js       ← Savings goals API
│       └── stats.js       ← Dashboard statistics API
├── frontend/
│   └── index.html         ← Complete React app in a single file
└── README.md              ← Project documentation
```

## 3. SETUP INSTRUCTIONS

**Step 1: Install Node.js**
Ensure you have Node.js installed on your computer. If not, download and install it from [nodejs.org](https://nodejs.org/).

**Step 2: Install Backend Dependencies**
Open your terminal (Command Prompt or PowerShell) and navigate to the backend folder:
```bash
cd backend
npm install
```

**Step 3: Start the Server**
Once installation is complete, start the backend server:
```bash
node server.js
```
*You should see a message saying `✅ Kharcha backend running → http://localhost:3001`.*

**Step 4: Open the Frontend**
Double-click the `frontend/index.html` file to open it in Google Chrome (or any modern web browser).

**Step 5: Register & Start Tracking**
Use the **Register** tab to create your first account securely and begin logging your daily expenses!

## 4. HOW TO USE ON OPPO A58 PHONE (OR ANY MOBILE)

Since this app is heavily optimized for a 6.56-inch screen, you'll want to test it on your phone:

1. **Find your PC IP address:** On Windows, open Command Prompt and type `ipconfig`. Look for the "IPv4 Address" (e.g., `192.168.1.15`).
2. **Edit `index.html`:** Open `frontend/index.html` in any text editor and find the API URL config near the top of the React script:
   ```javascript
   const API_URL = 'http://localhost:3001/api';
   ```
   Change `localhost` to your PC's IP address:
   ```javascript
   const API_URL = 'http://192.168.1.15:3001/api';
   ```
3. **Host the frontend:** You cannot simply send the HTML file to your phone. Use an extension like **VS Code Live Server** or run `npx serve` in the frontend folder to host the file on your local network.
4. **Open on Phone:** Open Chrome on your phone and type in the hosted address (e.g., `http://192.168.1.15:5500/index.html`).
5. **Important:** Both your PC and your phone **must be connected to the exact same Wi-Fi network**.

## 5. ALL API ENDPOINTS TABLE

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/register` | Create a new user account | No |
| `POST` | `/api/auth/login` | Authenticate user and return JWT | No |
| `GET`  | `/api/auth/me` | Return currently logged-in user details | **Yes** |
| `GET`  | `/api/expenses` | Get all expenses (supports `?category`, `?from`, `?to`) | **Yes** |
| `POST` | `/api/expenses` | Add a new expense | **Yes** |
| `PUT`  | `/api/expenses/:id` | Edit an existing expense (owner only) | **Yes** |
| `DELETE` | `/api/expenses/:id` | Delete an expense (owner only) | **Yes** |
| `GET`  | `/api/expenses/export/csv` | Download all user expenses as a CSV file | **Yes** |
| `GET`  | `/api/stats` | Get dashboard stats (totals, charts, goals, recurring) | **Yes** |
| `GET`  | `/api/budget` | Get user's current daily/monthly budget limits | **Yes** |
| `PUT`  | `/api/budget` | Update user's budget limits | **Yes** |
| `GET`  | `/api/goals` | Get all savings goals | **Yes** |
| `POST` | `/api/goals` | Create a new savings goal | **Yes** |
| `PUT`  | `/api/goals/:id` | Update saved amount for a goal | **Yes** |
| `DELETE` | `/api/goals/:id` | Delete a savings goal | **Yes** |
| `GET`  | `/api/recurring` | Get all recurring expenses | **Yes** |
| `POST` | `/api/recurring` | Add a new recurring expense | **Yes** |
| `DELETE` | `/api/recurring/:id` | Delete a recurring expense | **Yes** |

## 6. ALL FEATURES LIST
- **Authentication:** Secure JWT-based auth with encrypted bcrypt passwords.
- **Expenses Tracking:** Add, edit, delete, and view categorized expenses.
- **Budgeting:** Set daily and monthly spending limits with automatic warning banners.
- **Savings Goals:** Track multiple savings goals with visual progress bars.
- **Recurring Expenses:** Keep track of upcoming bills and subscriptions.
- **Export CSV:** Instantly download a complete spreadsheet of your financial history.
- **Charts:** Interactive 14-day spending bar charts and 6-month historical trend line charts powered by Chart.js.
- **Analytics:** Automatic calculations of top categories, monthly breakdowns, and all-time statistics.
- **Search & Filters:** Search history by description text, date ranges, and scrollable category pills.
- **Native UX:** Swipe-to-delete gestures, interactive bottom sheets, toast notifications, and skeleton loaders.

## 7. DATABASE TABLES
The SQLite database automatically provisions these 5 relational tables on first run:

**1. users**
`(id, username, email, password_hash, created_at)`

**2. expenses**
`(id, user_id, description, amount, category, date, note, created_at)`

**3. budgets**
`(id, user_id, monthly_limit, daily_limit, updated_at)`

**4. savings_goals**
`(id, user_id, title, target_amount, saved_amount, deadline, created_at)`

**5. recurring_expenses**
`(id, user_id, description, amount, category, frequency, next_due, active)`

## 8. TROUBLESHOOTING

- **Port 3001 already in use:**
  If the backend fails to start, another app is using port 3001. Open `backend/server.js`, change `const PORT = 3001;` to `3002`, and update the `API_URL` in `index.html` to match.
  
- **Phone cannot connect to backend:**
  Ensure Windows Defender Firewall is not blocking Node.js. Go to your firewall settings and allow "Node.js" on private networks. Double-check your IP address, and ensure both devices are on the same Wi-Fi.
  
- **Database file not created:**
  Ensure you are running the `node server.js` command directly inside the `backend` folder, not the root project folder.
  
- **Login not working / Unauthorized errors:**
  Check your browser's Developer Console (F12) for CORS or network errors. If you restarted your backend and deleted `kharcha.db`, you must clear your browser's `localStorage` (or just click Logout) to remove the old invalid JWT token.
