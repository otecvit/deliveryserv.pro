import React, {Component} from "react";
import { Redirect } from 'react-router';
import {
    Route,
    Link
} from 'react-router-dom'
import { connect } from 'react-redux';
import { Layout } from 'antd';
import Cookies from 'js-cookie'

import Startup from '../components/Startup';
import Dashboard from '../components/Dashboard';
import SiderMenu from '../components/SiderMenu';
import HeaderStatus from '../components/HeaderStatus';
import Categories from '../components/Menu/Categories';
import OptionSets from '../components/Menu/OptionSets';
import Dishes from '../components/Menu/Dishes';
import Menus from '../components/Menu/Menus';
import Orders from '../components/Orders/Orders';
import Clients from '../components/Clients/Clients';
import Locations from '../components/Locations/Locations';
import Sorting from '../components/Menu/Sorting';
import Stock from '../components/Stock/Stock';
import GeneralSettings from '../components/Settings/General';
import Times from '../components/Settings/Times';
import TypeOrder from '../components/Settings/TypeOrder';

import СheckNewOrder from '../components/СheckNewOrder';

const { Header, Content, Footer } = Layout;

class CmsWrapper extends Component {

    constructor(props) {
        super(props);
        this.handler = this.handler.bind(this)
        this.state = {
            loadingStatus: false,
          };
    }

    handler = () => {
        this.setState({
            loadingStatus: true,
        });
     }

     componentDidMount() {
        // получаем cookies
        const currentUser = Cookies.get('cookiename');
        if (typeof currentUser !== 'undefined') {
            
            const url = this.props.optionapp[0].serverUrl + "/SelectOwner.php"; // изменяем категорию
            fetch(url, {
              method: 'POST',
              headers: 
              {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(
              {
                chUID: currentUser,
              })
            }).then((response) => response.json()).then((responseJsonFromServer) => {
                if (responseJsonFromServer.owner.length)
                    this.props.onCheckUser(responseJsonFromServer.owner[0]);  // вызываем action

            }).catch((error) => {
                console.error(error);
            });


            //this.props.onCheckUser({chUID: currentUser});  // вызываем action
            //console.log(Cookies.get('cookiename'));
        } else 
            console.log("неизвестный чувак");
      }

    render() {
        const { loadingStatus } = this.state;


       
        if (typeof this.props.owner.chUID === 'undefined') {
          return <Redirect to="/login"/>
        }

        return (
            <div>
                { !loadingStatus ? <Startup handler = { this.handler }/> : 
                <Layout style={{ minHeight: '100vh' }}>
                    <SiderMenu/>
                    {this.state.loadStatus ? <СheckNewOrder/> : null}
                    <Layout>
                        <Header style={{ background: '#fff', padding: 0 }}>
                        <div style={{ padding: 16 }}>
                            <HeaderStatus />
                        </div>
                        
                        </Header>
                        <Content>
                        <div style={{ padding: 16, minHeight: 360 }}>
                            <Route exact path="/" component={Dashboard}/>
                            <Route exact path="/categories" component={Categories}/>
                            <Route exact path="/option-sets" component={OptionSets}/>
                            <Route exact path="/dishes" component={Dishes}/>
                            <Route exact path="/menus" component={Menus}/>
                            <Route exact path="/orders" component={Orders}/>
                            <Route exact path="/customers" component={Clients}/>
                            <Route exact path="/locations" component={Locations}/>
                            <Route exact path="/sorting" component={Sorting}/>
                            <Route exact path="/stock" component={Stock}/>
                            <Route exact path="/general-settings" component={GeneralSettings}/>
                            <Route exact path="/times" component={Times}/>
                            <Route exact path="/type-order" component={TypeOrder}/>
                        </div>
                        </Content>
                        <Footer style={{ textAlign: 'center' }}>
                            Deliveryserv ©2018 Created by overcode
                        </Footer>
                    </Layout>
                </Layout> }
            </div>
        )
    }
}

export default connect (
    state => ({
      orders: state.orders,
      optionapp: state.optionapp,
      owner: state.owner,
    }),
    dispatch => ({
      onEditStatus: (data) => {
          dispatch({ type: 'EDIT_ORDERS_STATUS', payload: data});
        },
      onCheckUser: (data) => {
           dispatch({ type: 'LOAD_OWNER_ALL', payload: data})
      },    
    })
  )(CmsWrapper);

/*
                <ul className="content-menu">
                    <li className="content-menu__item active"><Link to={`/`}>Рабочий стол</Link></li>
                    <li className="content-menu__item active"><Link to={`/invoices`}>Счета</Link></li>
                    <li className="content-menu__item"><Link to={`/meters`}>Показания счётчиков</Link></li>
                    <li className="content-menu__item"><Link to={`/login`}>выход</Link></li>
                </ul>
                <Route exact path={`/`} render={() => <h2>робочий стол</h2>}/>
                <Route path={`/invoices`} render={() => <h2>Invoices</h2>}/>
                <Route path={`/meters`} render={() => <h2>Meters</h2>}/>
*/