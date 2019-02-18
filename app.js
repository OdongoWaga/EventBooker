const express = require('express');
const bodyParser =require('body-parser');
const graphqlHttp =require('express-graphql');
const {buildSchema} = require('graphql');
const mongoose= require('mongoose');


const app =express();


//DB Setup

const db = require('./config/keys.js').mongoURI

//Connect to DB

mongoose
.connect(db,{ useNewUrlParser: true })
.then(()=> console.log('MongoDB Connected'))
.catch(err=> console.log(err)); 



const events = [];

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
    schema: buildSchema(
        //Not nullable, cannot be a list of nulls, returns an empty list but cannot return null
        `
        type Event {
            _id: ID!
            title:String!
            description: String!
            price: Float!
            date:String!
        }

        input EventInput {
            title:String!
            description: String!
            price: Float!
            date:String!
        }

        type RootQuery {
            events: [Event!]!

        }
        type RootMutation {
        createEvent(eventInput: EventInput): Event
        }
        
        schema {
            query: RootQuery
            mutation: RootMutation
        }
        `
    ),
    rootValue: {
        events: () => {
            return events;
        },
        createEvent: (args)=> {
            const event = {
                _id:Math.random().toString(),
                title:args.eventInput.title,
                description:args.eventInput.description,
                price: +args.eventInput.price,
                date: args.eventInput.date
            };
            events.push(event);
            return event;
        }
    },
    graphiql:true
}));


app.listen(3000);