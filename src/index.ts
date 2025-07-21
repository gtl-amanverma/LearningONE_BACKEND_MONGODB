import { app } from "./routes";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";
import { errorHandler, notFound } from "./middlewares/error_middlware";

dotenv.config();
const DBURL = process.env.MONGO_URL;
const port = process.env.PORT || 6001;
if (!DBURL) throw new Error("Invalid MongoDB URL");

// ✅ Create HTTP server and attach socket
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3005",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ✅ Socket.IO handlers
io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`📦 ${socket.id} joined room: ${roomId}`);
  });

  socket.on("sendMessage", ({ roomId, message }) => {
    console.log(`📨 Message to room ${roomId}:`, message);
    socket.to(roomId).emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

// ✅ Place middleware AFTER socket setup
app.use(notFound);
app.use(errorHandler);

// ✅ Connect to MongoDB
mongoose
  .connect(DBURL)
  .then(() => console.log("✅ Database connected"))
  .catch((err) => console.error(err));

// ✅ Start server
server.listen(port, () => {
  console.log(`🚀 Server running at ${process.env.BACKEND_URL}:${port}`);
});
