import express from "express";
import User from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

const usersRouter = express.Router()

const secret = process.env.SECRET

const generateToken = (data) => {
    return jwt.sign(data, secret, {expiresIn: "1800s"})
}


usersRouter.post("/", async (req, res) => {
    const {username, email, password} = req.body
    try{
        const response = await User.create({username, email, password})
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


//Create GET /login that sends an HTML form with two fileds: login username and password
//The result of the form is sent on POST /connect
usersRouter.get("/login", async (req, res) => {
    try {
        res.send(`
        <form action="/api/users/connect" method="post">
            <label for="username"> Username </label>
            <input type="text" placeholder="Enter your username" /><br/><br/>
            <label for="password"> Password </label>
            <input type="text" placeholder="Enter your password" /><br/><br/>
            <input type="submit" value="Submit" />
        </form>
        `)
    } catch (err) {
        res.status(500).json(err)
    }
})


//Check if user exists and password is valid
usersRouter.post("/connect", async (req, res) => {
    const {username, password} = req.body
    try{
        // const userExists = await User.findOne({username, password});
        // console.log(userExists)
        // if (!userExists) {
        //   return res.status(404).send({ message: `User with ${email}" does not exists` });
        // }

        // const validPassword = await bcrypt.compare(password, userExists.password)
        // console.log(validPassword)
        // if (!validPassword) {
        //     return res.status(404).send({message: `User with ${password} does not exists`})
        // }

        // const token = generateToken({email: userExists.email})


        //check if the login is john and the password doe in req.body
        if (!username === "John" && password === "Doe") {  
          return res.redirect("/login");
        } else {
          const token = generateToken({ username: "John" }); //if true sign a JWT sontaining a payload with your secret key

          if (!token) {
            res.redirect("/login");  //if false, redirect the user to login
          }

          console.log(token);

          res.set(token);
          res.set("Access-Control-Expose-Headers", "token"); //Set the JWT as a header to the response - https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Expose-Headers

          //Send back an HTML form with only one field (token) so that the user can check the validity of its token
          res.send(`
          <form action="/api/users/checkJWT" method="post">
              <label> Token </label>
              <input type="text" />
              <input type="submit" value="Submit" />
          </form>
          `);
        }
    } catch (err) {
        res.status(500).json(err)
    }
})


usersRouter.post("/checkJWT", async (req, res) => {
    const {token} = req.body
    try {
        // const response = await User.findOne(token)

        if(!token){
            res.redirect("/login") //If the JWT token is invalid: we redirect the user to the /login page
        } else {
            res.redirect("/admin") //If the JWT token is verified (and the payload matches what you previously set; e.g: admin: true for example): we redirect the user to the admin page
        }

    } catch(err){
        res.status(500).json8err
    }
})



export default usersRouter