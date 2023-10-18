import express from "express";
import User from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

const usersRouter = express.Router()

const secret = process.env.SECRET


usersRouter.post("/", async (req, res) => {
    const {name, email, password} = req.body
    try{
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

// usersRouter.get("/login", async (req, res) => {
//     const {email, password} = req.body
//     try {
//         const userExists = await User.findOne({email})
//         if (!userExists) {
//             return res.status(404).json({message: `User with ${email}" does not exists`})
//         }

//         const validPassword = await bcrypt.compare(password, userExists.password)
//         if (!validPassword) {
//             return res.status(404).json({message: `User with ${password} does not exists`})
//         }
//         res.status(200).json(response)
//     } catch (err) {
//         res.status(500).json(err)
//     }
// })


//Create GET /login that sends an HTML form with two fileds: login username and password
usersRouter.get("/login", async (req, res) => {
    try {
        res.send(`
        <form>
            <label> Username </label>
            <input type="text" placeholder="Enter your username" />
            <br/>
            <br/>
            <label> Password </label>
            <input type="text" placeholder="Enter your password" />
        </form>
        `)
    } catch (err) {
        res.status(500).json(err)
    }
})

usersRouter.post("/connect", async (req, res) => {
    const {email, password} = req.body
    try{
        const userExists = await User.findOne({ email });
        if (!userExists) {
          return res.status(404).json({ message: `User with ${email}" does not exists` });
        }

        const validPassword = await bcrypt.compare(password, userExists.password)
        if (!validPassword) {
            return res.status(404).json({message: `User with ${password} does not exists`})
        }



        res.status(201).json(response)
    } catch (err) {
        res.status(500).json(err)
    }
})






export default usersRouter