const express = require('express');
const bodyParser =require('body-parser');
const graphqlHttp =require('express-graphql');
const mongoose= require('mongoose');
const app =express();

const isAuth = require('./middleware/is-auth');

const graphQlSchema= require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');



//DB Setup

const db = require('./config/keys.js').mongoURI

//Connect to DB

mongoose
.connect(db,{ useNewUrlParser: true })
.then(()=> console.log('MongoDB Connected'))
.catch(err=> console.log(err)); 



app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

app.use(isAuth)


app.use('/graphql', graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql:true 
}));


app.listen(8000);