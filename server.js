const express = require('express');
const { graphqlHTTP } = require('express-graphql')
const mongoose = require('mongoose');
require('dotenv').config();

const schema = require('./schema/schema');

const app = express();

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
})

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}))

app.use('/', async (req, res) => {
    res.send('Welcome to GraphQL server. GraphQL endpoint is available at /graphql');
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})