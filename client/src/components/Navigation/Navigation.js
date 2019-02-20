import React from 'react';
import { NavLink} from 'react-router-dom';


const Navigation = (props) => {
  return (
    <header>
        <div className="main-navigation_logo">
        
      <h1>Eventually </h1>

        </div>

        <nav className="main-navigation_item">
        <ul>
            <li><NavLink to="/events">Events</NavLink></li>
            <li><NavLink to="/bookings">Bookings</NavLink></li>
            <li><NavLink to="/auth">Authenticate</NavLink></li>
        </ul>

        </nav>


    </header>
  )
}

export default Navigation
