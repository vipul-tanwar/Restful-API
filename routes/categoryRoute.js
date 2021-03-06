const express = require("express");
const mongoose = require("mongoose");
const {Category} = require("../models/products")
const _ = require("lodash");


const categoryRoute = express.Router();

//Category Routes

//Read all category
categoryRoute.get("/readall/category", (req, res) => {
    Category.find(function(err, foundCategory){
        if(!err){
            res.send(foundCategory);
        }else{
            res.send(err);
        }
    })
})

//Read category
categoryRoute.get("/read/category/:categoryTitle", (req, res) => {
    const requestPost = _.capitalize(req.params.categoryTitle);
    Category.findOne({categoryName: requestPost}, function(err, foundProduct){
        if(foundProduct){
            res.send(foundProduct);
        }else{
            res.send("No Category Found !");
        }
    })
})

//Post category
categoryRoute.post('/create/category', (req, res) => {
    const newCategory = new Category({
        categoryName : req.body.categoryName,
    })
    newCategory.save(function(err){
        if(!err){
            res.send("Succesfully created new category");
        }else{
            res.send(err);
        }  
    })
})

//Update category by PUT request
categoryRoute.put("/update/category/:categoryTitle", (req, res) => {
    const requestPost = _.capitalize(req.params.categoryTitle);
    Category.updateOne(
        {categoryName: requestPost},
        {categoryName: req.body.categoryName},
        {ovewrite: true},
        function(err){
            if(!err){
                res.send("Successfully updated Category");
            }else{
                res.send(err);
            }
        }
    )
})

//Update category by PATCH request
categoryRoute.patch("/update/category/:categoryTitle", (req, res) => {
    const requestPost = _.capitalize(req.params.categoryTitle);
    Category.findOneAndUpdate(
        {categoryName: requestPost},
        {$set: req.body},
        function(err){
            if(!err){
                res.send("Succesfully updated Category");
            }else{
                res.send(err);
            }
        }
    )
})

//Delete categoy by category name
categoryRoute.delete("/delete/category/:categoryTitle", (req, res) => {
    const requestPost = _.capitalize(req.params.categoryTitle);
    Category.deleteOne({categoryName: requestPost}, function(err){
        if(!err){
            res.send("Successfully deleted the Category");
        }else{
            res.send(err);
        }
    })
})

module.exports = categoryRoute;