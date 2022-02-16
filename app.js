const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const productRoute = require("./routes/productRoute");
const categoryRoute = require("./routes/categoryRoute");

mongoose.connect("mongodb://localhost:27017/Rest-API",{ useNewUrlParser: true, useUnifiedTopology: true})

const app = express();

app.use(bodyParser.urlencoded({extended: true}))

app.use('', productRoute);
app.use('', categoryRoute);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})