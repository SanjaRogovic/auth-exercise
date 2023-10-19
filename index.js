import express from "express"
import "dotenv/config"
import client from "./db/db.js"
import usersRouter from "./routes/users.js"
import cors from "cors";

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", usersRouter)

const port = process.env.PORT || 8000


client.on("connected", () => {
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`)
    })
    app.listen(80, () => {
        console.log('CORS-enabled web server listening on port 80')
      })
})
