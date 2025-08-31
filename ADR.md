# Architecture Decision Record (ADR)

## Title  
Marketplace Website Architecture for Multi-Role Users (Admin, Seller, Buyer)

## Status  
Accepted (Initial Version)

## Context  
We are building a **marketplace website** that supports three types of users:  
- **Buyer:** Can browse, search, and purchase products.  
- **Seller:** Can add, update, and manage products, and view analytics on sales, revenue, and customer interactions.  
- **Admin:** can visualize all the products, orders, and analytics.  

The system requires:  
- **Authentication & Authorization** (role-based access: Admin, Seller, Buyer).  
- **Product Management** (CRUD operations by sellers).  
- **Order Management** (buyers purchase products).  
- **Payment Integration** (secure checkout).  
- **Analytics & Dashboards** (for sellers and admin).  


## Decision  
We will design the marketplace using a **modular, service-oriented architecture** with the following decisions:  

1. **Frontend:**  
   - React for building a interactive UI.  
   - Separate dashboards for Admin, Seller, and Buyer with role-based navigation.  

2. **Backend:**  
   - Node.js with Express for building REST APIs.  
   - Role-based middleware for **auth & permissions**.  
   - JWT-based authentication for session handling.  

3. **Database:**  
   - MongoDB (NoSQL) for flexible schema design (products, orders, users).  
   - Collections: `users`, `products`, `cart`, `reviews`, `transactions`.  

4. **Payments:**  
   - Stripe for secure online transactions with idempotency to prevent double charging.  

5. **Analytics:**  
   - buyer dashboard: orders, settings , p
   - Seller dashboard: sales reports, feature products, revenue tracking.  
   - Admin dashboard: user growth, total sales, list of products  

6. **Deployment:**  
   - Cloud hosting (Vercel / Render).  

## Consequences  
- **Pros:**  
  - Clear separation of roles (buyer, seller, admin).  
  - Scalable backend with modular APIs.  
  - Easy analytics integration for sellers, buyer and admin.  
  - Secure authentication and payments.  

- **Cons:**  
  - Added complexity in role-based authorization.  
  - Maintaining dashboards for three roles increases UI/UX workload.  


## Alternatives Considered  
1. **Monolithic App (Single Codebase):** Easier to start, but harder to scale.  
2. **Microservices:** Better scalability but adds deployment & communication complexity.  
3. **SQL Database (PostgreSQL/MySQL):** Strong relational model, but less flexible for product listings.  


