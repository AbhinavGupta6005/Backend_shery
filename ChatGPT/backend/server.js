require("dotenv").config()
const app = require("./src/app.js")
const connectDB = require("./src/db/db.js")
const initSocketServer = require("./src/sockets/socket.server.js")
const httpServer = require("http").createServer(app);


connectDB()
initSocketServer(httpServer);




httpServer.listen(3000, () => {
    console.log("Server is running on port 3000")
})