import express from 'express';
import zod from 'zod';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import checkRole from '../middlwares/Roles.js';
import mongoose from 'mongoose';
import authMiddleWare from '../middlwares/Authmiddleware.js';
import Orders from '../models/Orders.js';

const OrderRoute=express.Router();

// for input validation
const singleProduct=zod.object({
    product:zod.string(),
    price:zod.number(),
    quantity:zod.number().min(1).default(1)
});
const Products=zod.array(singleProduct);


//creating an order
OrderRoute.post("/",authMiddleWare,async(req,res)=>{
    try {
        const {products}=req.body;
        // const {success}=Products.safeParse(products); //input validation
        // if(!success)
        //     return res.status(401).json({message:'Invalid inputs'});
        const userId=req.userId;
        
        let totalAmount=0;
        for(const product of products){
            totalAmount += product.quantity*product.price;
        }
        const saveOrder=new Orders({
            userId,
            products,
            totalAmount
        });
        await saveOrder.save();
        return res.status(201).json({ message: 'Order saved succesfully', saveOrder });  
    } catch (error) {
        console.log(error);
        res.status(501).json({ error: 'Error Processing Order' });
    }
})

// getting all orders for admin purposes
OrderRoute.get("/",authMiddleWare,checkRole("admin"),async(req,res)=>{
try {
    const orders=await Orders.find().populate('userId','name email')
    .populate('products.product','name price')
    return res.status(201).json({orders});
    
} catch (error) {
    console.log(error);
        res.status(501).json({ error: 'Error Retrieving Order' }); 
}
});

// getting all orders of a specific user
OrderRoute.get("/myorders",authMiddleWare,async(req,res)=>{
    try {
        const userId=req.userId;
        const orders=await Orders.find({userId:userId}).populate('userId','name email');
        if(!orders)
            return res.status(401).json({message:'Orders do not exist'});
        return res.status(200).json({orders});
    } catch (error) {
        console.log(error);
        res.status(501).json({ error: 'Error Retrieving Order' }); 
    }
})
export default OrderRoute;

OrderRoute.delete("/:Id",authMiddleWare,checkRole("admin"),async(req,res)=>{
    try {
        const userId=req.params.Id;
        const deleteOrder=await Orders.findByIdAndDelete({userId});
        if(!deleteOrder)
            return res.status(401).json({message:'error deleting orders'});
        return res.status(200).json({message:'Order deleted succesfully'});

        
    } catch (error) {
        console.log(error);
        res.status(501).json({ error: 'Error Deleting Order' }); 
    }
})