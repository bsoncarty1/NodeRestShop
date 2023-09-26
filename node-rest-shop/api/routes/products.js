const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

//anything that is passed to this file is already filtered by the app.js, so the path can just be '/'
//using just .find() gets all the objects in the DB
router.get("/", (req, res, next) => {
    Product.find()
      .select("name price _id")
      .exec()
      .then(docs => {
        const response = {
          count: docs.length,
          products: docs.map(doc => {
            return {
              name: doc.name,
              price: doc.price,
              _id: doc._id,
              request: {
                type: "GET",
                url: "http://localhost:3000/products/" + doc._id
              }
            };
          })
        };
        res.status(200).json(response);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });

router.post('/', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(), //creates a unique ID
        name: req.body.name,
        price: req.body.price
    });

    product
    .save()//stores it in the DB
    .then(result => {
        console.log(result)
        res.status(201).json({
            message: "Created product successfully.",
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result.id,
                request: {
                    type: "POST",
                    url: "http://localhost:3000/products/" + result._id
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    }); 
});

//for the use case of passing '/products/{productId}
router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
    .select('-__v') //removes the __v field from the response
    .exec()
    .then(doc => {
        if(doc){
            console.log("From Database: ", doc); //doc is the whole object from the database
            res.status(200).json({
                product: doc,
                request: {
                    type: "GET",
                    description: "To get all products, click link below.",
                    url: "http://localhost:3000/products"
                }
            }) //send the status
        }else{
            res.status(404).json({message: "No valid entry found for provided ID"});
        }
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err})
    })
});

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findByIdAndUpdate({_id: id},{$set: req.body}, {new: true})
    .exec()
    .then(result => {
        res.status(200).json({
            message: "Product updated successfullly",
            request: {
                type: "GET",
                url: "http://localhost:3000/products/" + id
            }
        })
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
})

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findByIdAndRemove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: "Product deleted",
            request: {
                description: "See remaining products by clicking link below.",
                type: "GET",
                url: "http://localhost:3000/products"
            }
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
});


module.exports = router;