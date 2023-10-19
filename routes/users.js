import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

const usersRouter = express.Router();

usersRouter.use(express.urlencoded({ extended: true }));

const secret = process.env.SECRET;

const generateToken = (data) => {
  return jwt.sign(data, secret, { expiresIn: "1800s" });
};

//authentication middleware
//Implement an authorization middleware function in your application, to check whether or not a user can access certain routes.
const auth = (req, res, next) => {
    const {token} = req.body
    if(!token){
        return res.sendStatus(401)
    }

    jwt.verify(token, secret, (err, User) => {
        if(err){
            return res.sendStatus(401)
        }
        req.user = User
        next()
    })
}


//register a user
usersRouter.post("/", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const response = await User.create({ username, email, password });
    res.status(201).json(response);
  } catch (err) {
    res.status(500).json(err);
  }
});


//get all users
usersRouter.get("/", async (req, res) => {
  try {
    const response = await User.find();
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Create GET /login that sends an HTML form with two fileds: login username and password
//The result of the form is sent on POST /connect
usersRouter.get("/login", (req, res) => {
  //STATIC VALUE being sent so no need to use try/catch as well there is no async/await in this case
  res.send(`
        <form action="/api/users/connect" method="post">
            <label for="username"> Username </label>
            <input type="text" name="username" placeholder="Login username" required/><br/><br/>
            <label for="password"> Password </label>
            <input type="password" name="password" placeholder="Password" required/><br/><br/>
            <input type="submit" value="Login" />
        </form>
        `);
});

//Check if user exists and password is valid w/STATIC VALUE
usersRouter.post("/connect", (req, res) => {
  const { username, password } = req.body;

  //check if the login is John and the password Doe in req.body
  if (username != "John" && password != "Doe") {
    return res.redirect("/api/users/login");
  } else {
    //if true sign a JWT containing a payload with your secret key
    const token = generateToken({ username: username });
    console.log(token);

    //Set the JWT as a header to the response - https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Expose-Headers
    //using res.set
    res.set("token", token);
    res.set("Access-Control-Expose-Headers", "token");

    //using res.header - provide property(authorization) and value(bearer) and concatenate token
    //res.header("Authorization", "Bearer " + token);
    

    //Send back an HTML form with only one field (token) so that the user can check the validity of its token
    res.send(`
          <form action="/api/users/checkJWT" method="post">
              <label> Token </label>
              <input type="text" name="token" placeholder="Login token" />
              <input type="submit" value="Submit" />
          </form>
          `);
  }
});

//Implement a route to create a user (hash the password stored in the database with bcrypt)
/*This time, when the user logs in, instead of checking if the login is john and the password doe in the body of the request, 
check it against the stored value database in the database. 
If it matches, send the user a JWT either as part of the response to the request, or as a header to the response (better).*/

// usersRouter.post("/connect", async (req, res) => {
//     const {username, password} = req.body
//     try{

//         //check if the user exists in the database
//         const userExists = await User.findOne({username})
//         if(!userExists){
//             res.redirect("/login")
//         }

//         //check if the password is valid
//         const validPassword = await bcrypt.compare(password, userExists.password)
//         if(!validPassword){
//             res.redirect("/login")
//         }

//         //generate token
//         const token = generateToken({username: userExists.username})
//         if(!token){
//             res.redirect("/login")
//         }

//         res.set("token", token)
//         res.set("Access-Control-Expose-Headers", "token");

//         res.send(`
//         <form action="/api/users/checkJWT" method="post">
//               <label> Token </label>
//               <input type="text" name="token" placeholder="Login token" />
//               <input type="submit" value="Submit" />
//           </form>
//         `)

//     }catch(err){
//         res.status(500).json(err)
//     }
// })


usersRouter.post("/checkJWT", auth, (req, res) => {
    try{
        res.send("You are at admin page")
    } catch(err){
        res.status(500).json(err)
    }
});


export default usersRouter;
