import bodyParser from "body-parser";
import dotenv from "dotenv";
import ejsMate from "ejs-mate";
import express from "express";
import session from "express-session";
import http from "http";
import methodOverride from "method-override";
import path from "path";
import { Server } from "socket.io";

dotenv.config();

import { dirname } from "path";
import { fileURLToPath } from "url";

import { authRouter } from "./routes/authRouter";
import { homeRouter } from "./routes/homeRouter";
import listingsRouter from "./routes/listingsRouter";
import messagesRouter from "./routes/messagesRouter";
import { postingRouter } from "./routes/postingRouter";
import { profileRouter } from "./routes/profileRouter";
import settingsRouter from "./routes/settingsRouter";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = 6563;

app.engine("ejs", ejsMate as any);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "..", "public")));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      return req.body._method;
    }
  })
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use((req, res, next) => {
  res.locals.currentUser = req.session.user;
  next();
});

app.use("/", homeRouter);
app.use("/profile", profileRouter);
app.use("/messages", messagesRouter);
app.use("/auth", authRouter);
app.use("/posting", postingRouter);
app.use("/listings", listingsRouter);
app.use("/settings", settingsRouter);

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("joinConversation", (conversationId) => {
    socket.join(conversationId);
    console.log(`User joined conversation: ${conversationId}`);
  });

  socket.on("sendMessage", (data) => {
    console.log("Message received:", data);

    socket.to(data.conversationId).emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
