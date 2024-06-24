import mongoose from "mongoose";

const paymentSchema = mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Orders' },
    captureId: { type: String, required: true },
    Amount: { type: Number, required: true },
    currency: { type: String, required: true },
    payment_method: { type: String },
    status: { type: String, enum: ['failed', 'successfull', 'processing'], default: 'processing' }

}, { timestamps: true });

const Payments = mongoose.model('Payments', paymentSchema);

export default Payments;