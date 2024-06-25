import e from 'express';
import express from 'express';
import nock from 'nock';
import stripe from 'stripe';

const stripeInstance = stripe('abcsjj3784873489o39');


const paymentMock=express.Router();

nock('https://api.stripe.com/v1')
.post('/payment_intents')
.reply(200,{
    id:'pi_123',
    amount:300,
    currency:'usd',
    status:'prcoessing'
});

nock('https://api.stripe.com/v1')
.post('/refunds')
.reply(200,{
    id:'pi_123',
    amount:2000,
    status:'succeeded'
});

//creating an payment intent
paymentMock.post("/paymentIntent",async(req,res)=>{
    try {
        
        const paymentIntent=await stripeInstance.paymentIntents.create({
            amount:200,
            currency:'usd'
        });
        if(!paymentIntent)
            return res.status(401).json({message:'error occured'});
        return res.status(201).json(paymentIntent);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error:error.message }) 
    }
});
 
// route to initiate refund

paymentMock.post("/refund",async(req,res)=>{
try {
    const refund=await stripeInstance.refunds.create({
        charge:'pi_123',
    });
    if(!refund)
        return res.status(401).json({message:'refund unsuccesfull'});
    return res.status(201).json(refund);
    
} catch (error) {
    console.log(error);
        res.status(500).json({ error:error.message }) 
}
});
export default paymentMock;