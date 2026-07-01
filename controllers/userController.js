import User from "../model/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const registerUSer = async (req, res) => {
    try {
        const {firstname, lastname, email, password} = req.body;
        if((firstname && lastname && email && password) === ""){
            return res.status(400).json({message: "All fields are required"})
        }
        const userExist = await User.findOne({email});
        if(userExist){
            return res.status(400).json({message: "User already exist"})
        }

        const encyptPassword = await bcrypt.hash(password,10)
        const user = await User.create({
            firstname,
            lastname,
            email,
            password: encyptPassword
        })
        const token = jwt.sign({id: user._id}, shhhh, {expiresIn: "1d"})
        user.token = token;
        user.password = undefined;
        await user.save();
        res.status(201).json({message: "User registered successfully", user})
    } catch (error) {
        res.status(500).json({message: "Registered user failed", error: error.message})
    }

}
