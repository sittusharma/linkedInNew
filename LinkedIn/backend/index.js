import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
import authRouter from "./routes/auth.routes.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import userRouter from "./routes/user.routes.js"
import postRouter from "./routes/post.routes.js"
import connectionRouter from "./routes/connection.routes.js"
import http from "http"
import { Server } from "socket.io"
import notificationRouter from "./routes/notification.routes.js"

dotenv.config()

const app = express()
const server = http.createServer(app)

// ✅ Socket.IO CORS (FIXED)
export const io = new Server(server, {
  cors: {
    origin: "https://linkedin-frontend-6rdi.onrender.com",
    credentials: true
  }
})

// ✅ Middlewares
app.use(express.json())
app.use(cookieParser())

// ✅ Express CORS (FINAL SAFE)
app.use(cors({
  origin: "https://linkedin-frontend-6rdi.onrender.com",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}))

// ✅ Routes
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/post", postRouter)
app.use("/api/connection", connectionRouter)
app.use("/api/notification", notificationRouter)

// ✅ Socket users map
export const userSocketMap = new Map()

io.on("connection", (socket) => {
  socket.on("register", (userId) => {
    userSocketMap.set(userId, socket.id)
    console.log(userSocketMap)
  })

  socket.on("disconnect", () => {
    for (let [key, value] of userSocketMap.entries()) {
      if (value === socket.id) {
        userSocketMap.delete(key)
      }
    }
    console.log("User disconnected:", socket.id)
  })
})

// ✅ Server start
const port = process.env.PORT || 5000

server.listen(port, () => {
  connectDb()
  console.log("server started")
})
