
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");
const app = express();
const searchRoutes = require('./routes/searchRoutes');
const notificationRoutes = require("./routes/notificationRoutes");
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


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
