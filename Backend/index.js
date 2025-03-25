import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import authRouter from "./Routes/auth.routes.js";
import typingRouter from "./Routes/typing.routes.js";
import os from 'os';


const app = express();
const port = process.env.PORT || 5000;
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRouter);
app.use("/typing", typingRouter);

app.get("/", (req, res) => {
    res.send("Backend is UP AND RUNNING😊👋😅😂❤️‍🔥🔥");
});

const rooms = {};
const colors = ["#eab308", "#ef4444", "#3b82f6", "#22c55e"];


io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("join-room", (roomId, user, testTime, userStats) => {
        if (!rooms[roomId] && user.host) {
            rooms[roomId] = {
                users: {},
                test: {
                    time: testTime,
                    started: false,
                },


            };
        }

        if (!rooms[roomId]) {
            socket.emit("room-not-found", { msg: "Room not found", roomId, roomExists: false });
            return;
        }

        if (Object.keys(rooms[roomId].users).length >= 4) {
            socket.emit("room-full");
            return;
        }

        // Assign color based on user count
        const userIndex = Object.keys(rooms[roomId].users).length;
        const userColor = colors[userIndex % colors.length]; // Cycles colors if more than 4 users

        rooms[roomId].users[user.email] = {
            ...user,
            socketId: socket.id,
            position: userIndex + 1,
            color: userColor,
        };

        socket.join(roomId);
        io.to(roomId).emit("user-joined", rooms[roomId].users);
    });

    socket.on("change-test-time", (roomId, testTime) => {
        if (!rooms[roomId]) {
            console.log(`Room ${roomId} does not exist. Ignoring test-time change request.`);
            return;
        }

        rooms[roomId].test.time = testTime;
        io.to(roomId).emit("test-time-change", testTime);
    });

    socket.on("game-started", (roomId) => {
        if (!rooms[roomId]) {
            console.log(`Room ${roomId} does not exist. Ignoring start-game request.`);
            return;
        }

        if (Object.keys(rooms[roomId].users).length < 2) {
            console.log(`Need at least 2 players to start game in room ${roomId}.`);
            return;
        }

        if (rooms[roomId].test.started) {
            console.log(`Game already started in room ${roomId}.`);
            return;
        }

        console.log(`Starting game in room ${roomId}.`);
        rooms[roomId].test.started = true;
        io.to(roomId).emit("start-game");
    });


    socket.on("word-index-change", (dataToUpdate) => {

        const roomId = dataToUpdate.roomId;

        if (!rooms[roomId]) {
            console.log(`Room ${roomId} does not exist. Ignoring word-index-change request.`);
            return;
        }

        if (!rooms[roomId].users[dataToUpdate.email]) {
            console.log(`User ${dataToUpdate.email} does not exist in room ${roomId}. Ignoring word-index-change request.`);
            return;
        }

        // Emit updated positions to all users in the room
        io.to(roomId).emit("position-update", rooms[roomId].users);

        console.log(`Updating word index for user ${dataToUpdate.email} in room ${roomId}.`);

        rooms[roomId].users[dataToUpdate.email].wordIndex = dataToUpdate.wordIndex;
        rooms[roomId].users[dataToUpdate.email].letterIndex = dataToUpdate.letterIndex;
        rooms[roomId].users[dataToUpdate.email].accuracy = dataToUpdate.accuracy;
        rooms[roomId].users[dataToUpdate.email].wpm = dataToUpdate.wpm;


    })





    socket.on("get-users", (userSocketId, roomId) => {
        // Check if the room exists
        if (!rooms[roomId]) {
            console.log(`Room ${roomId} does not exist. Ignoring get-users request.`);
            return;
        }



        // Emit the list of users in the room to the requesting socket
        io.to(userSocketId).emit("users", rooms[roomId].users);
    });

    socket.on("users", (roomId) => {
        io.to(roomId).emit("users", rooms[roomId].users);

    });

    socket.on("game-over", (roomId) => {
        if (!rooms[roomId]) {
            console.log(`Room ${roomId} does not exist. Ignoring game-over request.`);
            return;
        }

        // calculate position based on letter index and word index
        const users = rooms[roomId].users;
        const sortedUsers = Object.values(users).sort((a, b) => {
            if (a.wordIndex === b.wordIndex) {
                return b.letterIndex - a.letterIndex;  // Higher letter index first
            }
            return b.wordIndex - a.wordIndex;  // Higher word index first
        });


        // update position

        sortedUsers.forEach((user, index) => {
            users[user.email].position = index + 1;
        });
        console.log("Sorted Users", sortedUsers);

        // Emit the list of users in the room to the requesting socket
        io.to(roomId).emit("game-finished", rooms[roomId].users);

    });

    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});

const getLocalExternalIp = () => {
    const interfaces = os.networkInterfaces();
    for (const iface of Object.values(interfaces)) {
        for (const alias of iface) {
            if (alias.family === 'IPv4' && !alias.internal) {
                return alias.address;
            }
        }
    }
    return 'localhost';
};



server.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Server is running on http://${getLocalExternalIp()}:${port}`);
});