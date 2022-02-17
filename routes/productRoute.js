const express = require("express");
const mongoose = require("mongoose");
const {Product, Category} = require("../models/products")
const _ = require("lodash");

const productRoute = express.Router();


//Product Routes
// Read all products 
productRoute.get("/readall", function(req, res){
    Product.find().populate('categoryId').exec(function(err, foundProducts){
        if(!err){
            res.send(foundProducts);
        }else{
            res.send(err);            }
    })
})

//Read product
productRoute.get("/read/:productTitle", (req, res) => {
    const requestPost = _.capitalize(req.params.productTitle);
    Product.findOne({productName: requestPost}).populate('categoryId').exec(function(err, foundProduct){
        if(foundProduct){
            res.send(foundProduct);
        }else{
            res.send("No Product Found !");
        }
    })
})

//Post product
productRoute.post("/create", (req, res) => {

    const newCategory = new Category({
        categoryName : req.body.categoryName,
     })
  
    const newProduct = new Product({
        productName : req.body.productName,		
        qtyPerUnit : req.body.qtyPerUnit,		
        unitPrice : req.body.unitPrice,			
        unitInStock : req.body.unitInStock,		
        discontinued : req.body.discontinued,
    })

    var categoryN = req.body.categoryName;

    if(categoryN){
        Category.findOne({categoryName: categoryN}, function(err, foundPro){
            if(foundPro){
                //If Category already exist
                //console.log('Category already exist');
                newProduct.categoryId.push(foundPro);
                newProduct.save(function(err){
                    if(!err){
                        res.send("Succesfully created new Product with existing Category");
                    }else{
                        res.send(err);
                    }  
                })
            }else{
                //If Category n't exist
                //console.log('Categry Not Found');
                newProduct.categoryId.push(newCategory);
                newCategory.save();
                newProduct.save(function(err){
                    if(!err){
                        res.send("Succesfully created a new Product with new Category");
                    }else{
                        res.send(err);
                    }  
                })
            }
        })
    }
    else{
        //If category not mentioned
        //console.log("Category not mentioned")
        newProduct.save(function(err){
            if(!err){
                res.send("Succesfully created new Product");
            }else{
                res.send(err);
            }  
        })
    }
})

//Update product by PUT request
productRoute.put("/update/:productTitle", (req, res) => {
    const requestPost = _.capitalize(req.params.productTitle);
    Product.updateOne(
        {productName: requestPost},
        {
            productName : req.body.productName,		
            qtyPerUnit : req.body.qtyPerUnit,		
            unitPrice : req.body.unitPrice,			
            unitInStock : req.body.unitInStock,		
            discontinued : req.body.discontinued,
            categoryId: req.body.categoryId
        },
        {ovewrite: true},
        function(err){
            if(!err){
                res.send("Successfully updated Product");
            }else{
                res.send(err);
            }
        }
    )
})

//Update product by PATCH request
productRoute.patch("/update/:productTitle", (req, res) =>{
    const requestPost = _.capitalize(req.params.productTitle);
    Product.findOneAndUpdate(
        {productName: requestPost},
        {$set: req.body},
        function(err){
            if(!err){
                res.send("Succesfully updated Product");
            }else{
                res.send(err);
            }
        }
    )
})

//Delete product by product name
productRoute.delete("/delete/:productTitle", (req, res) => {
    const requestPost = _.capitalize(req.params.productTitle);
    Product.deleteOne({productName: requestPost}, function(err){
        if(!err){
            res.send("Successfully deleted the Product");
        }else{
            res.send(err);
        }
    })
})

module.exports = productRoute;