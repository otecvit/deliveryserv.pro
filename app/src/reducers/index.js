import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';

import Categories from './categories';
import OptionSets from './optionsets';
import Disches from './dishes';
import Menus from './menus';
import Orders from './orders';
import OptionApp from './optionapp';
import Customers from './customers';
import Locations from './locations';
import Stock from './stock';
import Staff from './staff';
import Owner from './owner';
import Tags from './tags';
import PushNotification from './pushNotification';

const allReducers = combineReducers ({
    routing: routerReducer,
    categories: Categories,
    optionSets: OptionSets,
    dishes: Disches,
    menus: Menus,
    orders: Orders,
    optionapp: OptionApp,
    customers: Customers,
    locations: Locations,
    stock: Stock,
    staff: Staff,
    owner: Owner,
    tags: Tags,
    pushNotification: PushNotification,
});

export default allReducers;