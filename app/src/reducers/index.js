import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';

import Categories from './categories';
import OptionSets from './optionsets';
import Disches from './dishes';
import Menus from './menus';

const allReducers = combineReducers ({
    routing: routerReducer,
    categories: Categories,
    optionSets: OptionSets,
    dishes: Disches,
    menus: Menus,
});

export default allReducers;