const { MongoClient } = require('mongodb');
require("dotenv").config()

let dbConnection

module.exports = {

    connectToDb: (cb) => {
        MongoClient.connect(process.env.MONGO_URI)
        .then((client) => {
            dbConnection = client.db()
            console.log('Connected to database');
            return cb()
        })
        .catch(err => {
            console.log(err);
            return cb(err)
        })
    },

    getDb : () => dbConnection
}