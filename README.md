# Sahara - Healthcare Management System

Sahara is a comprehensive healthcare management and hospital administration platform that streamlines the interaction between patients, doctors, administrative staff, and diagnostic laboratories. Designed for a seamless and intuitive user experience, Sahara comes with dedicated portals and role-based access for robust operations.

## 🚀 Key Features

* **Role-Based Access Control (RBAC):** Distinct dashboards and features for four user roles:
  * **Admins:** Manage platform users, oversee overall operations, and handle system settings.
  * **Doctors:** Manage patient appointments, view medical histories, write prescriptions, and review diagnostic reports.
  * **Patients:** Easy-to-use patient dashboard to book appointments (using a custom calendar), access prescriptions, and download lab reports.
  * **Labs:** Upload diagnostic reports securely and manage patient testing workflows.
* **Appointment Booking & Management:** Integrated custom calendar component for intuitive date and slot selection.
* **Prescriptions & Reports:** Digital prescription creation and PDF report generation (via `pdfkit`).
* **Email Notifications:** Automated email updates and alerts (via `nodemailer`).
* **File Management:** Secure file uploads for diagnostic reports and user profiles (via `multer`).

## 🛠️ Tech Stack

### Frontend
Situated in the `/sahara-frontend` directory.
* **Framework:** React 19 + Vite
* **Styling:** Tailwind CSS (v4)
* **Routing:** React Router DOM
* **HTTP Client:** Axios
* **UI/UX Enhancements:** React Toastify for notifications

### Backend
Situated in the `/sahara-backend` directory.
* **Runtime environment:** Node.js
* **Framework:** Express.js (v5)
* **Database:** MongoDB with Mongoose
* **Authentication:** JWT (JSON Web Tokens) & bcryptjs for secure password hashing
* **Utilities:** `multer` (file handling), `nodemailer` (emails), `pdfkit` (PDF rendering)

## 📁 Project Structure

```text
sahara/
├── sahara-backend/      # Node.js + Express backend application
│   ├── controllers/     # Route controller logic
│   ├── models/          # Mongoose database models (Admin, Doctor, Patient, Lab, Prescription, Report, etc.)
│   ├── routes/          # Express API route definitions
│   └── server.js        # Backend entry point
│
└── sahara-frontend/     # React + Vite frontend application
    ├── src/             # Source files
    │   ├── assets/      # Static assets and images
    │   └── pages/       # React page components (Home, Login, Dashboards)
    └── package.json     # Frontend dependencies
```

## ⚙️ Installation & Setup

### Prerequisites
* Node.js (v18+)
* MongoDB instance (Local or Atlas)
* Git

### Step-by-step Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/subhashree1407/Sahara.git
   cd Sahara
   ```

2. **Backend Setup:**
   ```bash
   cd sahara-backend
   npm install
   ```
   * Create a `.env` file in the `sahara-backend` folder with your environment variables (e.g., `PORT`, `MONGO_URI`, `JWT_SECRET`, `EMAIL_USER`, `EMAIL_PASS`).
   * Start the development server:
   ```bash
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd ../sahara-frontend
   npm install
   ```
   * Start the Vite development server:
   ```bash
   npm run dev
   ```

4. **Access the application:**
   * Frontend: `http://localhost:5173`
   * Backend API: `http://localhost:xxxx` (where `xxxx` is your configured backend port)

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/subhashree1407/Sahara/issues).

## 📝 License
This project is licensed under the ISC License.
