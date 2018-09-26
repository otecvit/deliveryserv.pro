import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, compose  } from 'redux';
import thunk from 'redux-thunk';
import registerServiceWorker from './registerServiceWorker';

import { Layout, Menu, Icon} from 'antd';

import createHistory from 'history/createBrowserHistory';
import { Route } from 'react-router';
import { ConnectedRouter} from 'react-router-redux';

import 'antd/dist/antd.css';

import allReducers from './reducers/index';
import Dashboard from './components/Dashboard';


const history = createHistory();
const {  Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;


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
    state = {
        collapsed: false,
    }


    onCollapse = (collapsed) => {
        this.setState (
            {collapsed}
        );
    }

    render() {
        return (
          <Layout style={{ minHeight: '100vh' }}>
            <Sider
                collapsible
                collapsed={this.state.collapsed}
                onCollapse={this.onCollapse}
            >
              <div className="logo" />
              <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                <Menu.Item key="1">
                  <Icon type="pie-chart" />
                  <span>Option 1</span>
                </Menu.Item>
                <Menu.Item key="2">
                  <Icon type="desktop" />
                  <span>Option 2</span>
                </Menu.Item>
                <SubMenu
                  key="sub1"
                  title={<span><Icon type="user" /><span>User</span></span>}
                >
                  <Menu.Item key="3">Tom</Menu.Item>
                  <Menu.Item key="4">Bill</Menu.Item>
                  <Menu.Item key="5">Alex</Menu.Item>
                </SubMenu>
                <SubMenu
                  key="sub2"
                  title={<span><Icon type="team" /><span>Team</span></span>}
                >
                  <Menu.Item key="6">Team 1</Menu.Item>
                  <Menu.Item key="8">Team 2</Menu.Item>
                </SubMenu>
                <Menu.Item key="9">
                  <Icon type="file" />
                  <span>File</span>
                </Menu.Item>
              </Menu>
            </Sider>
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

