import express from "express"
import "dotenv/config"
import client from "./db/db.js"
import usersRouter from "./routes/users.js"

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true })); //middleware to parse form data

app.use("/api/users", usersRouter)

const port = process.env.PORT || 8000


client.on("connected", () => {
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`)
    })
})
