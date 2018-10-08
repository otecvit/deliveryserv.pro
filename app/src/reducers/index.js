import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';

import Categories from './categories';
import OptionSets from './optionsets';

const allReducers = combineReducers ({
    routing: routerReducer,
    categories: Categories,
    optionSets: OptionSets,
});

export default allReducers;