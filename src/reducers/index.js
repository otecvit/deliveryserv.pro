import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';

const allReducers = combineReducers ({
    routing: routerReducer,
});

export default allReducers;