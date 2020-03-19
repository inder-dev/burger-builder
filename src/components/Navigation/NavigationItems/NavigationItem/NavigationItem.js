import React from 'react';
import { NavLink } from 'react-router-dom'; //NavLink for styling in place of Link

import classes from './NavigationItem.css';

const navigationItem = (props) => (
    <li className={classes.NavigationItem}>
        <NavLink
                to={props.link}
                exact={props.exact}
                activeClassName={classes.active}>{props.children}</NavLink> 
    </li>
);
//above we are setting activeClassName={classes.active} because the default active set by
//NavLink will not match with the active class of NavigationItem, since in React
//some unique numbers/constants are added to the class names in run time

export default navigationItem;