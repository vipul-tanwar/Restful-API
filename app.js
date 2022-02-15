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



//Product Routes
app.get("/readall", function(req, res){
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

app.post("/create", function(req, res){

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

app.put("/update/:productTitle", function(req, res){
    Product.updateOne(
        {productName: req.params.productTitle},
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

app.patch("/update/:productTitle",function(req, res){
    Product.findOneAndUpdate(
        {productName: req.params.productTitle},
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

app.delete("/delete/:productTitle", function(req, res){
    Product.deleteOne({productName: req.params.productTitle}, function(err){
        if(!err){
            res.send("Successfully deleted the Product");
        }else{
            res.send(err);
        }
    })
})

//Category Routes
app.get("/readall/category", function(req, res){
    Category.find(function(err, foundCategory){
        if(!err){
            res.send(foundCategory);
        }else{
            res.send(err);
        }
    })
})

app.get("/read/category/:categoryTitle", function(req, res){
    Category.findOne({categoryName: req.params.categoryTitle}, function(err, foundProduct){
        if(foundProduct){
            res.send(foundProduct);
        }else{
            res.send("No Category Found !");
        }
    })
})

app.post('/create/category/:categoryTitle', function(req, res){
    const newCategory = new Category({
        categoryName : req.params.categoryTitle,
    })
    newCategory.save(function(err){
        if(!err){
            res.send("Succesfully created new category");
        }else{
            res.send(err);
        }  
    })
})

app.put("/update/category/:categoryTitle", function(req, res){
    Category.updateOne(
        {categoryName: req.params.categoryTitle},
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

app.patch("/update/category/:categoryTitle",function(req, res){
    Category.findOneAndUpdate(
        {categoryName: req.params.categoryTitle},
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



app.listen(3000, function(){
    console.log("Server is running on port 3000");
})