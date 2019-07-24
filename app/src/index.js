import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import { connect } from 'react-redux';
import {createStore, applyMiddleware, compose  } from 'redux';
import thunk from 'redux-thunk';
import registerServiceWorker from './registerServiceWorker';

import { LocaleProvider } from 'antd';
import ruRU from 'antd/lib/locale-provider/ru_RU';

import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter} from 'react-router-redux';

import 'antd/dist/antd.css';
import './index.css';

import allReducers from './reducers/index';

import ApplicationContainer from './containers/ApplicationContainer';

const history = createHistory();

const store = createStore(allReducers, compose(applyMiddleware(thunk), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()));

const Application = connect(state => ({
  location: state.routing.location
}))(ApplicationContainer);

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <LocaleProvider locale={ruRU}>
                <Application/>
            </LocaleProvider>
        </ConnectedRouter>
    </Provider>,
  document.getElementById('root'),
);


registerServiceWorker();

