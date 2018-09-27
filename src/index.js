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

import allReducers from './reducers/index';
import Dashboard from './components/Dashboard';
import SiderMenu from './components/SiderMenu';


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
</div>
;

class MainClass extends React.Component {

    render() {
        return (
          <Layout style={{ minHeight: '100vh' }}>
              <SiderMenu/>
            <Layout>
              <Header style={{ background: '#fff', padding: 0 }} />
              <Content style={{ margin: '16px 16px', background: '#fff' }}>
                <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
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

