require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");
const app = express();
const http = require("http");
const server = http.createServer(app);
const searchRoutes = require('./routes/searchRoutes');
const notificationRoutes = require("./routes/notificationRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const adminRoutes = require("./routes/adminRoutes");
const stripeRoutes = require("./routes/stripeRoutes");
const { Server } = require("socket.io");


const io = new Server(server, {
  cors: { origin: "*" }
});

//for messaging between seller and buyer
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("sendMessage", (data) => {
    io.to(data.receiverId).emit("receiveMessage", data);
  });

  socket.on("joinRoom", (userId) => {
    socket.join(userId); 
  });
});

connectDB();

app.use(cors());
app.use(bodyParser.json());

//api routes

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);

app.use("/api/cart", cartRoutes);
app.use("/api/notifications", notificationRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/checkout', checkoutRoutes);

// Stripe webhook needs raw body, so mount before bodyParser.json
app.use('/api/stripe', (req, res, next) => {
  if (req.originalUrl === '/api/stripe/webhook') {
    express.raw({ type: 'application/json' })(req, res, next);
  } else {
    bodyParser.json()(req, res, next);
  }
});
app.use('/api/stripe', stripeRoutes);
app.use('/api/admin', adminRoutes);


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
