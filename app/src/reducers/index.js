import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';

import Categories from './categories';
import OptionSets from './optionsets';
import Disches from './dishes';
import Menus from './menus';
import Orders from './orders';
import OptionApp from './optionapp';
import Customers from './customers';

const allReducers = combineReducers ({
    routing: routerReducer,
    categories: Categories,
    optionSets: OptionSets,
    dishes: Disches,
    menus: Menus,
    orders: Orders,
    optionapp: OptionApp,
    customers: Customers,

});

export default allReducers;