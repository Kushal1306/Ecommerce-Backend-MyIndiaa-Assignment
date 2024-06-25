This repository contains backend code for E-commerce Applications. It handles various Operations of Users, Products, Orders, Payments. The routes (Rest Api's) and models schemas for the same were created and handled accordingly. 


- Used JSON Web Tokens for Authentication & authorization.

- Used zod for Data Validation.

- Implemented Paypal's payment Gatweway using it's sandbox Environment.
which includes ( initiating payment, capturing it, refund, getting payment info )

- Mocked Stripe's Payment Gateway using nock.

- Mocked Logistic Provider's and domain provider's Api endpoints using nock by creating endpoints for 
post shipment, tarck shipmet status, register domain, check domaininfo.

- Implemented rate limiting.

- Created indexes on columns, which are frequently used like email, sku, text index on product Name etc.

- Implemented thorough error handeling using try catch.

- Implemented Roles such as user, admin,with admin getting access to cruicial routes.

- Live Link of Backend deployed on vercel :https://backend-my-indiaa-gamma.vercel.app/

- Postman API documentation: https://documenter.getpostman.com/view/30343018/2sA3drGDxf


### Tech Stack
- **Node.js**
- **Express.js**
- **MongoDB as Database**



## API Endpoints

## Users

### Post a User (Signup)
- **Endpoint**: `/user/signup`
- **Request Body** 
``` json object
{
    "name":"Kushal Jain",
    "email":"kalakushal.jain@gmail.com",
    "password":"kushal@789"
}
```
- **Response**
```
{
    "message": "User Signed Up Succesfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2Njc3ZTNjYWJiN2JmMzY3YTNkMzkxNzUiLCJyb2xlIjoidXNlciIsImlhdCI6MTcxOTMxNzY2NSwiZXhwIjoxNzIxOTA5NjY1fQ.PHNOy-Cfeyx8U3t2pLXoMv_X3ONwB57iKZ1C8g_aOLA"
}
```
### Post a User (Signup)
- **Endpoint**: `/user/signin`
- **Request Body** 
``` json object
{
    "email":"kalakushal.jain@gmail.com",
    "password":"kushal@789"
}
```
- **Response**
```
{
    "message": "User Signedin Succesfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2Njc3ZTNjYWJiN2JmMzY3YTNkMzkxNzUiLCJyb2xlIjoidXNlciIsImlhdCI6MTcxOTMxNzY2NSwiZXhwIjoxNzIxOTA5NjY1fQ.PHNOy-Cfeyx8U3t2pLXoMv_X3ONwB57iKZ1C8g_aOLA"
}
```

## Product Endpoints

### Post a Product
- **Endpoint**:   `/product`
- **Request Body** 
``` json object
{
    "sku":"xyzlmn",
    "name":"Diary Milk",
    "price":10,
    "description":"It is a chocolate by cadbury",
    "category":"Chocolates",
    "stock":10
}
```
- **Response**
```
{
    "message": "Product saved succesfully",
    "product: product details
}
```

### Get All products
- **Endpoint**: `/product`
- **Response**
```json object
{
    "products": [
        {
            "_id": "6678138c5ee21e608857869f",
            "sku": "1234abcaz",
            "name": "Realme 7",
            "price": 15000,
            "stock": 10,
            "description": "It is an electronic phone by Realme Inc.",
            "category": "electronics",
            "createdAt": "2024-06-23T12:22:36.948Z",
            "updatedAt": "2024-06-23T12:22:36.948Z",
            "__v": 0
        },
       ,,,
    ]
}
```

### Get product by Name or sku

- **Endpoint**: `/product`
- **query parameter**: `name=productName`
- **Response**
```json object
{
    "products": [
        {
            "_id": "66780936253374ba86b4f45e",
            "sku": "123abc",
            "name": "Iphone 14 Pro",
            "price": 100000,
            "stock": 10,
            "description": "Iphone by Apple Inc.",
            "category": "electronics",
            "createdAt": "2024-06-23T11:38:30.643Z",
            "updatedAt": "2024-06-23T11:38:30.643Z",
            "__v": 0
        }
    ]
}
```


### Get product by Id

- **Endpoint**: `/product/:productId`
- **Response**
```json object
{
    "product": {
        "_id": "667809ea253374ba86b4f463",
        "sku": "1234abc",
        "name": "Toaster",
        "price": 2750,
        "stock": 10,
        "description": "Toaster it is.",
        "category": "electronics",
        "createdAt": "2024-06-23T11:41:30.002Z",
        "updatedAt": "2024-06-23T12:14:14.785Z",
        "__v": 0
    }
}
```

### Patch Product details

- **Endpoint**: `/product/:productId`
- **ReuestBody** 
```
{
    "price":2750
}
```
- **Response**
```json object
{
    "message": "Product Updated Succesfully"
}
```

## Order Endpoints

### Post a Order

- **Endpoint**: `/order`
- **Request Body**
```
{   "products":[
    { 
        "product":"6679111b7e0781a34cec929f",
        "price":10,
        "quantity":2

    }
]
}
```
- **Response**
```
{
    "message": "Order saved succesfully",
    "saveOrder": {
        "userId": "6678331ae7de2db3bfd7dd0e",
        "products": [
            {
                "product": "6679111b7e0781a34cec929f",
                "price": 10,
                "quantity": 2,
                "_id": "667ab4234cb771e27cb80bc2"
            }
        ],
        "totalAmount": 20,
        "status": "pending",
        "_id": "667ab4234cb771e27cb80bc1",
        "createdAt": "2024-06-25T12:12:19.335Z",
        "updatedAt": "2024-06-25T12:12:19.335Z",
        "__v": 0
    }
}
```
 
### Get all orders 

- **Endpoint**: `/orders`
- **Response**
```
{
    orders:[
        {
            all order details.
        }
    ]
}
```

### Get details of myorder

- **Endpoints**: `/order/myorders`
- **Response Body**
```
{
    "orders":[
        
            all order details.
    ]

}

```

## Payment Routes

### Intiate Payment (Post)

- **Endpoint**: `/payment/create-order/:orderId`
- **Response**:
```
{
    "id": "953878881B447042F",
    "links": [
        {
            "href": "https://www.sandbox.paypal.com/checkoutnow?token=953878881B447042F",
            "rel": "approve",
            "method": "GET"
        },..
    ]
}
```

### Capture Payment

- **Endpoints**: `/payment/capture-payment/:paymentOrderId`
- ** RequestBody**
```
{
    "orderId":"667911717e0781a34cec92a1"
}
```
- **Response**
```
{
    "id": "953878881B447042F",
    "status": "COMPLETED",
    "payment_source": {
        "paypal":{
..
        }
    },
    "purchase_units": [
    ]
    ....
                        
}
```

- Other Payment Endpoints

 ### 
 - **Refund Endpoints**: `post` `/payment/refund/:captureId`
 - **Payment Info**: `get` `/payment/:paymentOrderId`

## Mocking API's using Nock

## Mocking Logistic Provider Api

### Post Shipment

- **Endpoint**: `/shipment/`
- **RequestBody**:
```
{
    "address":"hyderabad, Inida",
    "phoneNumber":"9834637838"
}
```
- **Response**:
```
{
    "shipmentId": "1263536",
    "status": "Shipment created succesfully"
}
```

### Get shipment Status
- **Endpoint**: `/shipment/shipment-status`
- **query params** `shipmentId=id`
- **Response**
```
{
    "status": "in transit",
    "current_location": "Hyderabad",
    "estimated_delivery_data": "28-06-2023"
}
```

## Mocking Domain Provider

### Register Domain/ Check domain two diff Endpoints

- **Endpoint1** `get` `/domain/check?domainName=name`
- **Response**:
```
{
    "domainName": "x.com",
    "available": true,
    "price": "200",
    "currency": "INR"
}
```
-**Endpoint2** `post` `/domain/register`
- **Body**: 
```
{
    "domainName":"x.com"
}
```

- **Response**
```
{
      domainName: "x.com",
      registration_status: "success",
      transaction_amount: "100"
}
```

## Mock Integrations for Payment usig Nock

### Payment Intent for Stripe Mock
- **Endpoint** : `/paymentMock/paymentIntent`
- **Response**:
```
{
    "id": "pi_123",
    "amount": 300,
    "currency": "usd",
    "status": "prcoessing"
}

```

### Payment refund for Stripe Mock
- **Endpoint** : `/paymentMock/refund`
` **Body**:
```
{
    "id":"pi_123"
}
```
- **Response**:
```
{
    "id": "pi_123",
    "amount": 2000,
    "status": "succeeded"
}

```