import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Products'},
        price: { type: Number, required: true },
        quantity: { type: Number, default: 1 },
    }],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'cancelled', 'successfull', 'processing'], default: 'pending' }
},{timestamps:true});

//timestamps creates createdat, updatedat by default

const Orders = mongoose.model("Orders", orderSchema);

export default Orders;