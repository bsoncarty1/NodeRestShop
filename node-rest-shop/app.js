const express = require('express');
const app = express();
//a middleware logger
const morgan = require('morgan');
//parses json data and makes it more easily readable
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//where all the things from above are added to the request
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//for CORS, allows access to the server 
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
        );
        //the OPTIONS request is sent to us to see what options are available for the server
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    //allows the next routes to run after this step
    next();
})

//route to products.js
const productRoutes = require('./api/routes/products');
//route to orders.js
const ordersRoutes = require('./api/routes/orders');

//connection to the Mongo Atlas DB, the constant used is in the nodemon.json file
mongoose.connect("mongodb+srv://" + process.env.MONGO_ATLAS_PW + ":node-shop@node-rest-shop.rpnrlzo.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp");

//routes requests to the correct file
app.use('/products', productRoutes);
app.use('/orders', ordersRoutes);

//if this line is reached then no route listed above was able to handle the request
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

//this handles any other errors that are thrown from the database
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;