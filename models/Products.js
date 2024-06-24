import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    sku: { type: String, required: true, unique: true }, // unique code for each product
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    description: { type: String },
    category: { type: String }
},{timestamps:true});
// We can also have a image url of each product in Schema for its use in frontend purposes


const Products=mongoose.model("Products",ProductSchema);

export default Products;
