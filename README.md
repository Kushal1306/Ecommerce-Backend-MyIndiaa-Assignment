This repository contains backend code for E-commerce Applications. It handles various Operations of Users, Products, Orders, Payments. The routes and models for the same were created and handled accordingly. 



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
- **Description**:  Registering a User.
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
    "message": "User Signed in Succesfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2Njc3ZTNjYWJiN2JmMzY3YTNkMzkxNzUiLCJyb2xlIjoidXNlciIsImlhdCI6MTcxOTMxNzY2NSwiZXhwIjoxNzIxOTA5NjY1fQ.PHNOy-Cfeyx8U3t2pLXoMv_X3ONwB57iKZ1C8g_aOLA"
}
```