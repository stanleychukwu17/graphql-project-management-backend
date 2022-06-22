import express from 'express'
const graphqlHTTP = require('express-graphql')


//* creates an express app
const app = express();
app.use(express.json());

//* import {connectToDb, getDb} from './db'
const {ObjectId} = require('mongodb');
const {connectToDb, getDb} = require('./db')

//* opens connection to the mongodb database before listening for request
let db: any
connectToDb((err: any) => {
    if (!err) {
        // now we can start listening for events
        app.listen(4000, () => {
            console.log('now listening to request from port 4000')
        })

        // updates our database variable
        db = getDb()
    } else {
        console.log(`we have an error, error: ${err}`)
    }
})


// app.listen(4000, () => {
//     console.log('now listening to request from port 4000')
// })