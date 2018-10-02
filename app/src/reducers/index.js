import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';

import Categories from './categories';

const allReducers = combineReducers ({
    routing: routerReducer,
    categories: Categories,
});

export default allReducers;