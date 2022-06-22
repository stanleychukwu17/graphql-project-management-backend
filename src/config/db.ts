// import {MongoClient} from 'mongodb'
const mongoose = require('mongoose');

// let dbUrl:string = 'mongodb://localhost:27017/bookstore'
let dbUrl:any = process.env.MONGODB_URI || 'mongodb://localhost:27017/bookstore'

const connectDB = async () => {
    const conn = await mongoose.connect(dbUrl);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
};

module.exports = connectDB;
