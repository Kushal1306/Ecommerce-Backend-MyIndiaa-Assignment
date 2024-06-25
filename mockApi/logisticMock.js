import express from 'express';
import nock from "nock";
import axios from "axios";
// 
const logisticMock = express.Router();



// Mock Api for posting Shipment
nock("https://api.logisticprovider.com/v1")
    .post('/shipment')
    .reply(201, {
        shipmentId: "1263536",
        status: "Shipment created succesfully",

    })

// Mock api for getting status
nock("https://api.logisticprovider.com/v1")
    .get("/shipment-status")
    .query(true)
    .reply(200, {
        status: "in transit",
        current_location: "Hyderabad",
        estimated_delivery_data: '28-06-2023'
    });

// Mock Api for getting shipmet rates
nock("https://api.logisticprovider.com/v1")
    .post("/shipmentRates")
    .reply(200, {
        Charge: "100 Rs",
        distance: "20 Km"
    })



logisticMock.post("/", async (req, res) => {
    try {
        const { details } = req.body;
        const response = await axios.post("https://api.logisticprovider.com/v1/shipment", details);
        console.log(response.data);
        return res.status(200).json(response.data);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'error occured' })
    }
});

logisticMock.get("/shipment-status", async (req, res) => {
    try {
        const shipmentId = req.body.shipmentId;
        const response = await axios.get("https://api.logisticprovider.com/v1/shipment-status", {
            params: { shipmentId }
        });
        console.log(response.data);
        return res.status(200).json(response.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'error occured' })
    }
});

logisticMock.post("/rates", async (req, res) => {
    try {
        const { details } = req.body;
        const response = await axios.post("https://api.logisticprovider.com/v1/shipmentRates", details);
        console.log(response.data);
        return res.status(200).json(response.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'error occured' })
    }
});

export default logisticMock