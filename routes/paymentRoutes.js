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

dotenv.config();
const PaymentRoute=express.Router();


// PayPal setup
let environment = new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID,process.env.PAYPAL_CLIENT_SECRET);
let client = new paypal.core.PayPalHttpClient(environment);


// Create Order
PaymentRoute.post('/create-order',authMiddleWare, async (req, res) => {
  try {
    console.log(req.body.amount);
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: req.body.amount
        }
      }]
    });

    const response = await client.execute(request);
    const approvalUrl = response.result.links.find(link => link.rel === 'approve').href;
    res.json({ id: response.result.id, approvalUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Capture Payment
PaymentRoute.post('/capture-payment/:orderId',authMiddleWare, async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});
    const response = await client.execute(request);
    res.json(response.result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get details of a payment

PaymentRoute.get("/:orderId",authMiddleWare,async(req,res)=>{
    try {
        const orderId=req.params.orderId;
        const request=new paypal.orders.OrdersGetRequest(orderId);
        const response=await client.execute(request);
        res.status(202).json(response.result);
    } catch (error) {
        res.status(404).json({error:'Payment not found'});
    }
})

export default PaymentRoute;