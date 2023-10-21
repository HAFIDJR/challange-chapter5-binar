require('dotenv').config()

const express = require('express')
const app = express();
const swaggerUi = require('swagger-ui-express');
const YAML = require('yaml');
const {PORT = 3000} = process.env
const endpointv1 = require('./routes/enpoinv1')
const cors = require('cors')
app.use(cors())
app.use(express.json())
app.use('/api/v1',endpointv1)


// Documentation API
const fs = require("fs");
const file = fs.readFileSync('./swagger.yaml', 'utf8');
const swaggerDocument = YAML.parse(file);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 404
app.use((req,res,next)=>{

    res.status(404).json({
        status:false,
        message:'Not Found',
        data:null
    })
})


// 500
app.use((err,req,res,next)=>{

    res.status(500).json({
        status:false,
        message:'Internal Server Error',
        data:err.message
    })
})



module.exports = app;