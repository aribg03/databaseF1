const express = require('express');
const cors = require('cors');
require('dotenv').config();
const driversRouter = require('./routes/drivers')

class Server {
    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.basePath = '/api/v1';
        this.driversPath = `${this.basePath}/drivers`;

        this.middlewares();
        this.routes();
    }
    
    middlewares() {
        this.app.use(cors());
        this.app.use(express.json())
    } 

    routes() {
        this.app.use(this.driversPath, driversRouter);

    }

    listen(){
        this.app.listen(this.port,() => {
            console.log("Server listening on port " + this.port);
        })
    }
}

module.exports = Server;