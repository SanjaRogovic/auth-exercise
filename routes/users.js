import express from "express";
import User from "../models/User.js"

const usersRouter = express.Router()


usersRouter.post("/", async (req, res) => {
    try{
        const {name, email, password} = req.body
        const response = await User.create({name, email, password})
        res.status(201).json(response)
    } catch (err) {
        res.status(500).json(err)
    }
})

usersRouter.get("/", async (req, res) => {
    try {
        const response = await User.find()
        res.status(200).json(response)
    } catch (err) {
        res.status(500).json(err)
    }
})






export default usersRouter