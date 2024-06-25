import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import connectToDB from './config/db.js';
import UserRoute from './routes/userRoutes.js';
import Productroute from './routes/productRoutes.js';
import OrderRoute from './routes/orderRoutes.js';
import PaymentRoute from './routes/paymentRoutes.js';
import logisticMock from './mockApi/logisticMock.js';
import domainMock from './mockApi/domainMock.js';
import paymentMock from './mockApi/paymentMock.js';

dotenv.config();

const app = express();
const port = process.env.port || 3000;

const apiLimiter=rateLimit({
    windowMs:15*60*1000, //15 mins
    max:100,
    message:'Too may requests from this Ip Address, Please Try again after 15 minutes'
});

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(apiLimiter);
//app.use(morgan('combined'));

app.use("/api/user",UserRoute);
app.use("/api/product",Productroute);
app.use("/api/order",OrderRoute);
app.use("/api/payment",PaymentRoute);
app.use("/api/shipment",logisticMock);
app.use("/api/domain",domainMock);
app.use("/api/paymentMock",paymentMock);

app.get("/", (req, res) => {
    return res.send("Hello world");
});

connectToDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Listening on PORT ${port}`);
        });
    }).catch((error) => {
        console.error('Error connecting to database:', error);
        process.exit(1);
    });

app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});



