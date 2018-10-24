import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, compose  } from 'redux';
import thunk from 'redux-thunk';
import registerServiceWorker from './registerServiceWorker';

import { Layout } from 'antd';

import createHistory from 'history/createBrowserHistory';
import { Route } from 'react-router';
import { ConnectedRouter} from 'react-router-redux';

import 'antd/dist/antd.css';
import './index.css';

import allReducers from './reducers/index';
import Dashboard from './components/Dashboard';
import SiderMenu from './components/SiderMenu';
import Categories from './components/Menu/Categories';
import OptionSets from './components/Menu/OptionSets';
import Dishes from './components/Menu/Dishes';
import Menus from './components/Menu/Menus';
import Orders from './components/Orders/Orders';


const history = createHistory();
const { Header, Content, Footer } = Layout;

const store = createStore(allReducers, compose(applyMiddleware(thunk), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()));

/*
function handler() {
  ReactDOM.render(
    <Provider store = {store}>
      <ConnectedRouter history={history}>
        {ContentPage}
      </ConnectedRouter>
    </Provider>,
    document.getElementById('root')
  );
  
};
*/
//const Login = <LoginPage  handler = {handler}/>;

const ContentPage =
<div>
    <Route exact path="/" component={Dashboard}/>
    <Route exact path="/categories" component={Categories}/>
    <Route exact path="/option-sets" component={OptionSets}/>
    <Route exact path="/dishes" component={Dishes}/>
    <Route exact path="/menus" component={Menus}/>
    <Route exact path="/orders" component={Orders}/>
</div>
;

class MainClass extends React.Component {

    render() {
        return (
          <Layout style={{ minHeight: '100vh' }}>
              <SiderMenu/>
            <Layout>
              <Header style={{ background: '#fff', padding: 0 }} />
              <Content>
                <div style={{ padding: 16, minHeight: 360 }}>
                 {ContentPage}
                </div>
              </Content>
              <Footer style={{ textAlign: 'center' }}>
                Deliveryserv ©2018 Created by overcode
              </Footer>
            </Layout>
          </Layout>
        );
      }
}

ReactDOM.render(
    <Provider store = {store}>
        <ConnectedRouter history={history}>
            <MainClass />
        </ConnectedRouter>
    </Provider>,
  
    document.getElementById('root')
  );
 
registerServiceWorker();

