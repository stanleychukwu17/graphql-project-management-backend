// import {MongoClient} from 'mongodb'
const mongoose = require('mongoose');

// let dbUrl:string = process.env.MONGODB_URI || 'mongodb://localhost:27017/my_mgmt_db'
let dbUrl:string = 'mongodb://localhost:27017/my_mgmt_db'

const connectDB = async () => {
    const conn = await mongoose.connect(dbUrl);
    console.log(`MongoDB Connected: ${conn.connection.host} to database ${dbUrl}`);
};

module.exports = connectDB;
