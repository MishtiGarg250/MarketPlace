
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
const reviewRoutes = require("./routes/reviewRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const adminRoutes = require("./routes/adminRoutes");
const stripeRoutes = require("./routes/stripeRoutes");
const { Server } = require("socket.io");


// const io = new Server(server, {
//   cors: {
//     origin: ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
//     methods: ["GET", "POST"],
//     credentials: true
//   },
//   transports: ['polling', 'websocket'],
//   allowEIO3: true
// });



// Socket.IO for real-time chat
// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);
//   console.log("Connection query:", socket.handshake.query);

  
//   const userId = socket.handshake.query.userId;
//   if (userId && userId !== 'undefined') {
//     socket.join(userId);
//     console.log(`[SOCKET] User ${userId} auto-joined personal room with socket ID: ${socket.id}`);
//     socket.emit('roomJoined', { userId, roomId: userId });
//   }

//   // User joins their personal room for receiving messages (legacy support)
//   socket.on("joinRoom", (userId) => {
//     socket.join(userId);
//     console.log(`[SOCKET] User ${userId} joined room ${userId} with socket ID: ${socket.id}`);
    
//     // Send confirmation back to client
//     socket.emit('roomJoined', { userId, roomId: userId });
//   });

//   // Join conversation room
//   socket.on("joinConversation", (conversationId) => {
//     socket.join(`conversation_${conversationId}`);
    
//     socket.emit('conversationJoined', { conversationId });
//   });

  

//   // Handle new chat messages
//   socket.on("sendMessage", async (data) => {
   
//     await handleSocketMessage(data, socket, io);
//   });

//   // Handle user disconnect
//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//   });

//   // Legacy support for old message format
//   socket.on("sendMessage_legacy", (data) => {
//     io.to(data.receiverId).emit("receiveMessage", data);
//   });
// });

connectDB();


app.use(cors({
  origin: "https://dealperfect-marketplace.vercel.app/", // your frontend domain
  methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
  credentials: true
}));
app.use(bodyParser.json());

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/admin', adminRoutes);


app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    details: err.stack || err
  });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
