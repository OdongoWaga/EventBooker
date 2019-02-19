const express = require('express');
const bodyParser =require('body-parser');
const graphqlHttp =require('express-graphql');
const {buildSchema} = require('graphql');
const mongoose= require('mongoose');

const bcrypt = require('bcryptjs');

const Event = require('./models/event');
const User = require('./models/user');


const app =express();


//DB Setup

const db = require('./config/keys.js').mongoURI

//Connect to DB

mongoose
.connect(db,{ useNewUrlParser: true })
.then(()=> console.log('MongoDB Connected'))
.catch(err=> console.log(err)); 





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

        type User {
            _id: ID!
            email: String!
            password: String
        }

        input EventInput {
            title:String!
            description: String!
            price: Float!
            date:String!
        }

        input UserInput {
            email: String!
            password:String!
        }

        type RootQuery {
            events: [Event!]!

        }
        type RootMutation {
        createEvent(eventInput: EventInput): Event
        createUser(userInput: UserInput): User
        }
        
        schema {
            query: RootQuery
            mutation: RootMutation
        }
        ` 
    ), 
    rootValue: {
        events: () => {
        
           return Event.find().then(events => {
                return events.map(event=> {
                    return {...event._doc, _id:event.id};
                })
            }).catch(err => {
                throw err;
            })
        },
        createEvent: (args)=> {
          /*  const event = {
                _id:Math.random().toString(),
                title:args.eventInput.title,
                description:args.eventInput.description,
                price: +args.eventInput.price,
                date: args.eventInput.date
            }; */
            const event = new Event({
                title:args.eventInput.title,
                description:args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: '5c6bceb897733408aca8aa4b'

            });
            let createdEvent;

             return event
            .save()
            .then(
            result => {
                createdEvent=  {...result._doc, _id:result._doc._id.toString()}
                return User.findById('5c6bceb897733408aca8aa4b');
                
            }).then(user => {
                if(!user){
                    throw new Error("User Not Found")
                }
                user.createdEvents.push(event);
                return user.save();
            })
            .then(result => {
                return createdEvent
            })
            .catch(err=> {
            console.log(err);
            throw err;
            });
        },

        createUser: args => {
             return User.findOne({email:args.userInput.email}).then(user => {
                if(user){
                    throw new Error('User Already Exists')
                }
                return bcrypt.hash(args.userInput.password,12);
            }) 
            .then(hashedPassword =>{
                const user = new User({
                    email:args.userInput.email,
                    password: hashedPassword
    
                })
                return user.save();
            })
            .then(result => {
                //set password to null so that it is never sent back to the front end
                return {...result._doc, password:null, _id:result.id}
            })
            .catch(err =>{
                throw err;
            })
            
        }
    },
    graphiql:true
}));


app.listen(3000);