import express from 'express';
import zod from 'zod';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Users from '../models/Users.js';


const UserRoute = express.Router();

//input validation

const signUpBody = zod.object({
    name: zod.string(),
    email: zod.string().email(),
    password: zod.string().min(8),
    role:zod.string().optional()
})

UserRoute.post("/signup", async (req, res) => {
    try {
        const { success } = signUpBody.safeParse(req.body);
        if (!success) {
            return res.status(411).json({ message: 'Incorrect inputs' });
        }
        const { name, email, password } = req.body;

        //if user already exists with the given credentials
        const existingUser = await Users.findOne({ email: email });
        if (existingUser) {
            return res.status(411).json({ message: 'Email Already taken/user exits' });
        }
        const newUser=new Users(req.body);
        await newUser.save();
        // const newUser = await Users.create({
        //     name,
        //     email,
        //     password
        // })
        const token = jwt.sign({ userId:newUser._id, role:newUser.role }, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.status(201).json({
            message:"User Registered Succesfully",
            token:token
        })

    } catch (error) {
        console.log(error);
        res.status(501).json({ error: 'Error registering user' });
    }

});

const singInBody=zod.object({
    email:zod.string().email(),
    password:zod.string().min(8)
});

UserRoute.post("/signin",async(req,res)=>{
try {
    const {success}=singInBody.safeParse(req.body);
    if(!success)
        return res.status(401).json({message:'Incorrect Inputs'});
    const {email,password}=req.body;
    const existingUser=await Users.findOne({email:email});
    //if the user doesnt exist
    if(!existingUser)
        return res.status(404).json({message:'User Does Exist with the given Credentials'});

    const passswordMatch=await bcrypt.compare(password,existingUser.password);
    if(!passswordMatch)
        return res.status(404).json({message:'Incorrect Credentials'});

    const token=jwt.sign({userId:existingUser._id, role:existingUser.role },process.env.JWT_SECRET,{expiresIn:'30d'});

    return res.status(201).json({
        message:"User Signed in Succesfully",
        token:token
    });
    
} catch (error) {
    console.log(error);
    res.status(501).send({ error: 'Error registering user' });
}
});

export default UserRoute;


// we can also have a patch request to update details of the user.