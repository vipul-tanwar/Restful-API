const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/Rest-API",{ useNewUrlParser: true, useUnifiedTopology: true})

const app = express();

app.use(bodyParser.urlencoded({extended: true}))

const categorySchema = new mongoose.Schema({
    categoryName : String
})

const productSchema = new mongoose.Schema({
    productName : String,		
    qtyPerUnit : Number,		
    unitPrice : Number,			
    unitInStock : Number,		
    discontinued : Boolean,	
    categoryId : [{ 
        type: mongoose.Schema.Types.ObjectId , 
        ref: 'category'}]


})

const Category = mongoose.model("category", categorySchema)
const Product = mongoose.model("product", productSchema)

app.get('/readall', function(req, res){
    Product.find().populate('categoryId').exec(function(err, foundProducts){
        if(!err){
            res.send(foundProducts);
        }else{
            res.send(err);            }
    })
})

app.get("/read/:productTitle", function(req, res){
    Product.findOne({productName: req.params.productTitle}).populate('categoryId').exec(function(err, foundProduct){
        if(foundProduct){
            res.send(foundProduct);
        }else{
            res.send("No Product Found !");
        }
    })
})

app.listen(3000, function(){
    console.log("Server is running on port 3000");
})