import express from 'express';
import zod from 'zod';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import checkRole from '../middlwares/Roles.js';
import mongoose from 'mongoose';
import authMiddleWare from '../middlwares/Authmiddleware.js';
import Products from '../models/Products.js';
import dotenv from 'dotenv';
import paypal from '@paypal/checkout-server-sdk';
import Payments from '../models/payments.js';
import Orders from '../models/orders.js';

dotenv.config();
const PaymentRoute=express.Router();


// PayPal setup
let environment = new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID,process.env.PAYPAL_CLIENT_SECRET);
let client = new paypal.core.PayPalHttpClient(environment);


// Create Payment Order for an OrderId in Orders Table
PaymentRoute.post('/create-order/:orderId',authMiddleWare, async (req, res) => {
  try {
    const orderId=req.params.orderId;
    const myOrder=await Orders.findById(orderId);

    if(!myOrder)
        return res.status(401).json({message:'orderId doesnt exist'});

    console.log(myOrder);
    console.log(myOrder.totalAmount);

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value:myOrder.totalAmount.toString()
        }
      }]
    });

    const response = await client.execute(request);
    // const approvalUrl = response.result.links.find(link => link.rel === 'approve').href;
    res.json({ id: response.result.id, links:response.result.links });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Capture Payment
PaymentRoute.post('/capture-payment/:paymentOrderId',authMiddleWare, async (req, res) => {
  try {
    const paymentOrderId= req.params.paymentOrderId;
    const request = new paypal.orders.OrdersCaptureRequest(paymentOrderId);
    request.requestBody({});
    const response = await client.execute(request);

    const captureId = response.result.purchase_units[0].payments.captures[0].id;
    const amount = response.result.purchase_units[0].payments.captures[0].amount.value;
    const currency = response.result.purchase_units[0].payments.captures[0].amount.currency_code;
    const status = response.result.purchase_units[0].payments.captures[0].status.toLowerCase();

    const payment=new Payments({
        orderId:req.body.orderId,
        paymentOrderId,
        captureId,
        Amount:amount,
        currency,
        payment_method:'PayPal',
        status
    })

    await payment.save();

 // finding if order present by Id
    const order=await Orders.findById(req.body.orderId);
    if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
    order.status='successfull';
    await order.save();
    res.json(response.result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get details of a payment

PaymentRoute.get("/:paymentOrderId",authMiddleWare,async(req,res)=>{
    try {
        const paymentOrderId=req.params.paymentOrderId;
        const request=new paypal.orders.OrdersGetRequest(paymentOrderId);
        const response=await client.execute(request);
        res.status(202).json(response.result);
    } catch (error) {
        res.status(404).json({error:'Payment not found'});
    }
})

// Refund a payment captured
PaymentRoute.post("/refund/:captureId",authMiddleWare,checkRole("admin"),async(req,res)=>{
    try {
        const captureId=req.params.captureId;
        const request=new paypal.payments.CapturesRefundRequest(captureId);
        request.requestBody({
          amount:{
            value:req.body.amount,
            currency_code:'USD'
          }  
        });
        const response=await client.execute(request);
        res.status(200).json(response.result);
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

export default PaymentRoute;