import express from "express";
import User from "../models/User.js"
// import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import cors from "cors"

const usersRouter = express.Router()

usersRouter.use(cors())

usersRouter.use(express.urlencoded({extended: true}));

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
usersRouter.get("/login", (req, res) => {
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
        // const userExists = await User.findOne({username});
        // // console.log(userExists)
        // if (!userExists) {
        //   return res.redirect("/login")
        // }

        // const validPassword = await bcrypt.compare(password, userExists.password)
        // // console.log(validPassword)
        // if (!validPassword) {
        //     return res.redirect("/login")
        // }

        // const token = generateToken({username: userExists.username})
        // if (!token) {
        //     res.redirect("/login");  //if false, redirect the user to login
        //   }
        // console.log(token);


        //check if the login is John and the password Doe in req.body
        if (username != "John" && password != "Doe") {  
          return res.redirect("/api/users/login");
        } else {
          const token = generateToken({ username: "John" }); //if true sign a JWT sontaining a payload with your secret key
          console.log(token);

          res.set("token", token);
          res.set("Access-Control-Expose-Headers", "token"); //Set the JWT as a header to the response - https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Expose-Headers

          //Send back an HTML form with only one field (token) so that the user can check the validity of its token
          res.send(`
          <form action="/api/users/connect/checkJWT" method="post">
              <label> Token </label>
              <input type="text" />
              <input type="submit" value="Submit" />
          </form>
          `);
        }
    }catch(err) {
            res.status(500).json(err)
        
    }
} 
)


usersRouter.post("/connect/checkJWT", async (req, res) => {
    const {token} = req.body
    try {
        // const response = await User.findOne(token)

        const verifyToken = jwt.verify(token, secret, () => {

            if (!token){
                return res.redirect("/api/users/login") //If the JWT token is invalid: we redirect the user to the /login page
            }
        })
        res.send(verifyToken)
    } catch(err){
        res.status(500).json(err)
    }
})


usersRouter.post("/admin", (req, res) => {
    try{
        res.send(`
        <h1> You are on admin page </h1>
        `)

    } catch(err){
        res.status(500).json(err)
    }
})



export default usersRouter