import React from 'react';
import './EventItem.css';

const eventItem = props => (
    <li key={props._id} className="events__list-item">
    <div>
        <h1>{props.title}</h1>
        <h2> Sh{props.price} - {new Date(props.date).toLocaleDateString()}</h2> 
    </div>
    <div>
       {props.userId===props.creatorId ? (<p> This is your event </p>) : (<button>View Details </button>) }
       
    </div>

    </li>
)

export default eventItem; 