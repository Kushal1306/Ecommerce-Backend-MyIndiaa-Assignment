import express, { response } from 'express';
import axios from 'axios';
import nock from 'nock';

const domainMock=express.Router();

nock("https://api.domainprovider.com/v1")
.get("/check")
.query(true)
.reply(200,{
domainName:"x.com",
available:true,
price:"200",
currency:"INR"
})

nock("https://api.domainprovider.com/v1")
.post("/register")
.reply(201,{
   domainName:"x.com",
   registration_status:"success",
   transaction_amount:"100"
})

nock("https://api.domainprovider.com/v1")
.get("/domainInfo")
.reply(200,{
   domainName:"x.com",
   domainOwner:"Kushal Jain",
   regId:"1263763"
});

domainMock.get("/check",async(req,res)=>{
try {
    const {details}=req.body;
    const response=await axios.get("https://api.domainprovider.com/v1/check",{
        params:{
            details
        }
    })
    console.log(response.data);
    res.status(201).json(response.data);
} catch (error) {
    console.log(error);
    res.status(500).json({message:error.message});
}
});

domainMock.post("/register",async(req,res)=>{
    const domainName=req.body.domainName;
    const response=await axios.post("https://api.domainprovider.com/v1/register",domainName);
    console.log(response.data);
    return res.status(201).json(response.data);
});


export default domainMock;