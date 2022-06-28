import express from 'express'
require('dotenv').config()
const {graphqlHTTP} = require('express-graphql')
const schema = require('./graphql-schema/schema');
const connectDB = require('./config/db') // database connection

//* creates an express app
const port = process.env.PORT || 4000
const app = express();
app.use(express.json());
app.use('/graphql', graphqlHTTP({schema, graphiql: true}))

//* opens connection to the mongodb database before listening for request
connectDB().then(() => {
    app.listen(port, () => {
        console.log(`now listening to request from port ${port}`)
    })
})

app.get('/', (req, res) => {
    res.json({'msg':'okay', 'cause':'You may proceed with your coding!'})
})

// app.listen(port, () => {
//     console.log(`now listening to request from port ${port}`)
// })