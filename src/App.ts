import express from 'express'
require('dotenv').config()
const {graphqlHTTP} = require('express-graphql')

const schema = require('./graphql-schema/schema');


//* creates an express app
const port = process.env.PORT || 4000
const app = express();
app.use(express.json());
app.use('/graphql', graphqlHTTP({schema, graphiql: true}))

//* import {connectToDb, getDb} from './db'
const {ObjectId} = require('mongodb');
const {connectToDb, getDb} = require('./db')

//* opens connection to the mongodb database before listening for request
let db: any
connectToDb((err: any) => {
    if (!err) {
        // now we can start listening for events
        app.listen(port, () => {
            console.log(`now listening to request from port ${port}`)
        })

        // updates our database variable
        db = getDb()
    } else {
        console.log(`we have an error, error: ${err}`)
    }
})

app.get('/', (req, res) => {
    res.json({'msg':'okay', 'cause':'You may proceed with your coding!'})
})

// app.listen(port, () => {
//     console.log(`now listening to request from port ${port}`)
// })