const { MongoClient } = require('mongodb');

let dbConnection

module.exports = {

    connectToDb: (cb) => {
        MongoClient.connect("mongodb+srv://admin-sayak:test123@motion.shne8nx.mongodb.net/?retryWrites=true&w=majority")
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