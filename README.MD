# MarketPlace

MarketPlace is a full-stack marketplace application where users can register, log in, browse products, manage favorites, interact with sellers, and view reviews.  
The backend is built with **Node.js**, **Express**, and **MongoDB**, and the frontend uses **React**.

---

## Features

- **Authentication & Authorization**
  - User registration and login
  - Role-based access (User, Seller, Admin)
  - JWT-based authentication

- **User Management**
  - View and update user profile
  - Add and remove favorite products

- **Seller Management**
  - View seller profiles
  - Update seller details (for sellers/admin)
  - View seller reviews

- **Favorites System**
  - Add/remove products to/from favorites
  - View all favorites

- **Products & Orders**
  - CRUD operations for products
  - Checkout system
  - Stripe integration for payments

- **Admin Features**
  - View platform statistics
  - Manage users, products, and orders

---

## Tech Stack

- **Backend**: Node.js, Express.js  
- **Database**: MongoDB (Mongoose)  
- **Frontend**: React.js  
- **Authentication**: JWT & bcrypt  
- **File Uploads**: Multer & Cloudinary  
- **Payment**: Stripe API  

---

## Project Structure

```
MarketPlace/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── index.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.tsx
│   │   ├── main.js
│   │   └── ...
│   ├── public/
│   ├── package.json
│   └── ...
├── .env.example
├── README.md
└── ...
``` 
---
## Backend Setup

### Prerequisites
- Node.js (>= 16.x)
- MongoDB (local or cloud)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/MishtiGarg250/MarketPlace.git
   cd MarketPlace
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your environment variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   STRIPE_SECRET_KEY=your_stripe_secret
   CLOUDINARY_URL=your_cloudinary_url
   ASSIGNMENT_SEED=your_assignment_seed
   USERNAME=admin_username
   PASSWORD=admin_password  
   EMAIL=admin_email
   ```
4. Start the server:
   ```bash
   npm start
   ```
---
## Frontend Setup
### Prerequisites
- Node.js (>= 16.x)
- npm
1. cd client
2. npm install
3. npm run dev
---

