const express = require("express");
const mongoose = require("mongoose");

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

module.exports = { Product, Category};