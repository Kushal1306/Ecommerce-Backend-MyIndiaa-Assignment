import express from 'express';
import zod from 'zod';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import checkRole from '../middlwares/Roles.js';
import Products from '../models/Products.js';
import mongoose from 'mongoose';
import authMiddleWare from '../middlwares/Authmiddleware.js';

const Productroute = express.Router();

//input validation of a product

const ProductBody = zod.object({
    sku: zod.string(),
    name: zod.string(),
    price: zod.number(),
    description: zod.string(),
    category: zod.string(),
    stock: zod.number().optional()
})


Productroute.post("/", authMiddleWare, checkRole("admin"), async (req, res) => {
    try {
        // input validation
        const { success } = ProductBody.safeParse(req.body);
        if (!success)
            return res.status(400).json({ message: 'Incorrect Inputs' });
        const sku = req.body.sku;
        const existingProduct = await Products.findOne({ sku: sku });
        if (existingProduct)
            return res.status(401).json({ message: 'Product already exists' });
        const newProduct = new Products(req.body);
        await newProduct.save();
        return res.status(201).json({ message: 'Product saved succesfully' });
    } catch (error) {
        console.log(error);
        res.status(501).json({ error: 'Error Saving product' });
    }
});

// Route get all products or get products by name/sku
Productroute.get("/", authMiddleWare, async (req, res) => {
    try {
        const productName = req.query.name || "";
        const productsku=req.query.name||"";
        console.log(productName);
        console.log(productsku);
        const products = await Products.find({
            $or: [
                { name: { $regex: productName, $options: 'i' } },
                { sku: { $regex: productsku, $options: 'i' } }
            ]

        });
        return res.status(200).json({ products });
    } catch (error) {
        console.log(error);
        res.status(501).json({ error: 'Error retreiving products' });
    }
});

//route to get all products by id

Productroute.get("/:id",authMiddleWare,async(req,res)=>{
    const productId=req.params.id;
    try {
        const product=await Products.findById(productId);
        if(!product)
            return res.status(401).json({message:'Product doesnt exist'});
        return res.status(200).json({product});
        
    } catch (error) {
        console.log(error);
        res.status(501).json({ error: 'Error retreiving products' });
    }

});

// update details of a product
// we can use patch Request instead of put as we may or maynot replace entire document

Productroute.patch("/:productId", authMiddleWare, checkRole("admin"), async (req, res) => {
    const productId = req.params.productId;
    try {
        const updatedProduct = await Products.findByIdAndUpdate(
            productId,
            { $set: req.body },
            { new: true }
        );
        if (!updatedProduct)
            return res.status(404).json('Error updating products');
        return res.status(200).json({ message: 'Product Updated Succesfully' });
    } catch (error) {
        console.log(error);
        res.status(501).json({ error: 'Error updating products' });
    }
})

//Delete a product by its id

Productroute.delete("/:productId", authMiddleWare, checkRole("admin"), async (req, res) => {
    const productId = req.params.productId;
    try {
        const deleteProduct = await Products.findByIdAndDelete(productId);
        if (!deleteProduct)
            return res.status(401).json({ message: 'Error deleting the product' });
        return res.status(200).json({ message: 'Product deleted successfully' });

    } catch (error) {
        console.log(error);
        res.status(501).json({ error: 'Error updating products' });
    }
})


export default Productroute;
