const express = require('express');
const bodyParser =require('body-parser');
const graphqlHttp =require('express-graphql');
const {buildSchema} = require('graphql');

const app =express();

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
    schema: buildSchema(
        //Not nullable, cannot be a list of nulls, returns an empty list but cannot return null
        `
        type RootQuery {
            events: [String!]!

        }
        type RootMutation {

        }
        
        schema {
            query: RootQuery
            mutation: RootMutation
        }
        `
    ),
    rootValue: {}
}));

app.listen(3000);