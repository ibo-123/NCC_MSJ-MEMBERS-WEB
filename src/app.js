const cors = require("cors");
const express = require("express");
const app = express();

app.use(cors());
app.use(express.json());
app.get("/" , (req , res) =>{
        res.setEncoding("NCC_MSJ WEB Backend is Running");
}
);

module.exports = app;