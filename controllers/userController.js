import User from "../model/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register a new user
export const registerUser = async (req, res) => {
    try {
        // Catch the data from the request body
        const {firstname, lastname, email, password} = req.body;
        // Check if all fields are filled
        if((firstname && lastname && email && password) === ""){
            return res.status(400).json({message: "All fields are required"})
        }
        // Check if the user already exists in the database
        const userExist = await User.findOne({email});
        if(userExist){
            return res.status(400).json({message: "User already exist"})
        }
        // Encrypt the password to a normal string.
        const encyptPassword = await bcrypt.hash(password,10)
        //Create a new user in the database with the encrypted password and generate a token for the user.
        const user = await User.create({
            firstname,
            lastname,
            email,
            password: encyptPassword
        })
        //Now generate a token for the user using jwt.sign() method. The token will contain the user's id and will expire in 1 day. After generating the token, we will save it to the user's document in the database and return a success response with the user data (excluding the password).
        const token = jwt.sign({id: user._id}, shhhh, {expiresIn: "1d"})
        user.token = token;
        user.password = undefined;
        await user.save();
        res.status(201).json({message: "User registered successfully", user})
    } catch (error) {
        res.status(500).json({message: "Registered user failed", error: error.message})
    }

}
// Login a user
export const loginUser = async (req, res) => {
    try {
        // Catch the data from the request body
        const {email, password} = req.body;
        // Check if all fields are filled
        if((email && password) === ""){
            return res.status(400).json({message: "All fields are required"})
        }
        // Check if the user exists in the database
        const user = await User.findOne({email});
        // If the user does not exist, return an error message
        if(!user){
            return res.status(400).json({message: "User not found"})
        }
        // Compare the password from the request body with the hashed password in the database using bcrypt.compare() method. If the passwords do not match, return an error message. If the passwords match, generate a token for the user using jwt.sign() method. The token will contain the user's id and will expire in 1 day. After generating the token, we will save it to the user's document in the database and return a success response with the user data (excluding the password).
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(400).json({message: "Invalid password"})
        }
        // Create a token for the user using jwt.sign() method. The token will contain the user's id and will expire in 1 day. After generating the token, we will save it to the user's document in the database and return a success response with the user data (excluding the password).
        const token = jwt.sign({id: user._id}, shhhh, {expiresIn: "1d"})
        user.token = token;
        user.password = undefined;
        // Save the user document with the token to the database and return a success response with the user data (excluding the password). We will also set a cookie with the token that will expire in 3 days and is httpOnly for security reasons.
        await user.save();
        // Set cookie options for security and expiration
        // create a cookie with the token and set it to expire in 3 days. The httpOnly option is set to true to prevent client-side scripts from accessing the cookie.
        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        }
        // Set the cookie with the token and return a success response with the user data (excluding the password). The cookie will expire in 3 days and is httpOnly for security reasons.
        res.cookie("token", token, options).status(200).json({message: "User logged in successfully", user})
        
        
    } catch (error) {
        res.status(500).json({message: "Login failed", error: error.message})
    }
}
