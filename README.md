# Kharnak - Authentic Living & Tourism Platform

Kharnak is a comprehensive web platform designed to promote and manage authentic living, tourism, and culture. It features a robust e-commerce system for local products, a booking system for tours and stays, and a rich media section for stories and publications.

## 🚀 Project Overview

The project is divided into three main components:
- **Frontend**: A React-based user interface for customers to browse products, book tours, and read stories.
- **Admin Panel**: A management dashboard for administrators to handle orders, bookings, content, and users.
- **Backend API**: A Node.js and Express server providing RESTful APIs, connected to a MongoDB database.

---

## 🛠️ Technology Stack

### Frontend & Admin
- **Core**: React 19, Vite
- **Styling**: Tailwind CSS 4, Framer Motion (for animations)
- **State Management & Routing**: React Context API, React Router Dom
- **HTTP Client**: Axios
- **UI Components**: React Icons, React Toastify, Swiper (for carousels)

### Backend
- **Server**: Node.js, Express
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JSON Web Token (JWT), Bcrypt
- **File Storage**: Cloudinary, Multer
- **Payments**: Stripe, Razorpay
- **Email**: Nodemailer
- **Utilities**: Dotenv, Validator, Password-validator, Cors

---

## ✨ Key Features

### E-commerce
- Product browsing and detailed views.
- Shopping cart functionality with persistent storage.
- Secure checkout process integrated with Stripe and Razorpay.
- Order history and profile management for users.

### Tourism & Booking
- Detailed tour listings and seasonal packages.
- Interactive booking system for stays and tours.
- Applicant management for scheduled tours.

### Culture & Content
- Story sharing and archival of local culture.
- Publication management for articles and media.
- Interactive "Like" feature for engagement.

### Admin Management
- **Dashboard**: Real-time overview of business metrics.
- **Inventory**: Full CRUD for products, tours, and stories.
- **Order/Booking Management**: Processing orders and managing tour applicants.
- **User Management**: Role-based access control and admin management.
- **Communication**: Integrated message management for customer inquiries.

---

## 📁 Project Structure

```text
Kharnak/
├── admin/          # React Admin Dashboard
├── backend/        # Node.js Express API
├── frontend/       # React Customer-facing App
└── README.md       # Project Documentation
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (Latest LTS recommended)
- MongoDB Atlas account or local installation
- Cloudinary, Stripe, and Razorpay accounts for full functionality

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Kharnak
   ```

2. **Setup Backend**
   - Navigate to `/backend`
   - Run `npm install`
   - Create a `.env` file with necessary keys (MongoDB URI, API keys, etc.)
   - Start the server: `npm run server`

3. **Setup Frontend**
   - Navigate to `/frontend`
   - Run `npm install`
   - Start the dev server: `npm run dev`

4. **Setup Admin**
   - Navigate to `/admin`
   - Run `npm install`
   - Start the dev server: `npm run dev`

---

## 🛤️ Future Roadmap

- [ ] Implementation of advanced analytics in the Admin Dashboard.
- [ ] Integration of more local payment gateways.
- [ ] Multilingual support for global audience.
- [ ] Mobile application for tour guides and on-the-go management.
