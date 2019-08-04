import React, {Component} from "react";
import { Redirect } from 'react-router';
import {
    Route,
    Link
} from 'react-router-dom'
import { connect } from 'react-redux';
import { Layout, Modal, Alert, Button, Tabs } from 'antd';
import Cookies from 'js-cookie'

import LoadingScreen from '../components/LoadingScreen';
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
import Tags from '../components/Menu/Tags';
import Stock from '../components/Stock/Stock';
import Push from '../components/Push/Push';
import Staff from '../components/Staff/Staff';
import GeneralSettings from '../components/Settings/General';
import Times from '../components/Settings/Times';
import TypeOrder from '../components/Settings/TypeOrder';
import Payment from '../components/Settings/Payment';
import EmailNotifications from '../components/Settings/EmailNotifications';
import AutoExecution from '../components/Settings/AutoExecution';
import Customisation from '../components/Settings/Customisation';
import Information from '../components/Settings/Information';
import License from '../components/Settings/License';
import Application from '../components/Settings/Application';

import СheckNewOrder from '../components/СheckNewOrder';

const { Content, Footer } = Layout;
const { TabPane } = Tabs;

const ModalAbout = ({ visible, handleCancel }) => {
    return (
        <Modal
            title="О компании"
            visible={visible}
            onCancel={handleCancel}
            style={{ top: 40 }}
            width={700}
            footer={[
                <Button key="submit" type="default" onClick={handleCancel}>
                    Закрыть
                </Button>,
            ]}
            >
            <Tabs tabPosition="left" style={{ height: 400 }}>
                <TabPane tab="О нас" key="1">
                    <h2>О нас</h2>
                    <p>Мы молодая команда талантливых программистов. Мы поддерживаем высокий уровень предоставляемых услуг. Количество наших клиентов продолжает расти, и мы делаем все, чтобы оправдать ваше доверие.<br/>Спасибо, что выбрали нас!</p>
                </TabPane>
                <TabPane tab="Контакты" key="2">
                    <h2>Контакты</h2>
                    <p>Получить консультацию можно <b>ежедневно с 8:00 до 21:00.</b></p>
                    <p>Телефоны:<br/>+375 29 7-096-096<br/>+375 29 518-82-90</p>
                    <p>Viber: +375295188290<br/>E-mail: info@deliveryserv.pro</p>
                </TabPane>
                <TabPane tab="Реквизиты" key="3">
                    <h2>Реквизиты</h2>
                    <p>ИП Исаев Антон Валерьевич<br/>
                    Cвидетельство о государственной регистрации, выдано Администрацией Октябрьского района г. Витебска 8 декабря 2016 г.
                    </p>
                    <p>р/с BY95 ALFA 3013 2389 7100 1027 0000<br/>ЗАО «Альфа-Банк» г. Минск, ул. Сурганова, 43-47, МФО ALFABY2X</p>
                    <p>Адрес для почтовых отправлений:<br/>210009, Республика Беларусь, г. Витебск, ул. Чапаева, 9-33</p>
                    <p>УНП 390458727</p>
                    <p>Контактные телефоны: +375 29 7-096-096, +375 29 518-82-90</p>
                </TabPane>
            </Tabs>
        </Modal>
    )
};

class CmsWrapper extends Component {
    
    constructor(props) {
        super(props);
      //  this.handler = this.handler.bind(this)
        this.state = {
            loadStatus: false,
            loadingStatus: false,
            checkCookies: false,
            showMessage: false,
            visibleAbout: false,
          };
    }
    
    handler = () => {
        this.setState({
            loadingStatus: true,
        });
     }

     componentDidMount()  {
        // получаем cookies
        
        const currentUser = Cookies.get('cookiename');
        if (typeof currentUser !== 'undefined') {
            
            const url = this.props.optionapp[0].serverUrl + "/SelectOwner.php"; // изменяем категорию
            
            fetch(url, {
              method: 'POST',
              body: JSON.stringify(
              {
                chUIDStaff: currentUser,
              })
            }).then((response) => response.json()).then((responseJsonFromServer) => {
                if (responseJsonFromServer.owner.length) {
                    this.props.onCheckUser(responseJsonFromServer.owner[0]);  // вызываем action
                    //this.timer = setInterval(()=> this.getItems(), 1000);
                }

                this.setState ({
                    checkCookies: true,
                })

            }).catch((error) => {
                console.error(error);
            });
        } else {
             this.setState ({
                    checkCookies: true,
                })
        }

        
      }

      componentWillUnmount() {
        //this.timer = null; // here...
      }

      getItems() {
        this.setState({loadStatus: !this.state.loadStatus})
      }


    sendMailVerification = () => {
        const { showMessage } = this.state;

        const urlLocation = this.props.optionapp[0].serverUrl + "/SendMailActivation.php"; // изменяем категорию
              fetch(urlLocation, {
                method: 'POST',
                body: JSON.stringify(
                {
                    chUIDStaff: this.props.owner.chUIDStaff,
                })
              }).then((response) => response.json()).then((responseJsonFromServer) => {
                  //console.log(responseJsonFromServer);

              }).catch((error) => {
                  console.error(error);
              });
        

        this.setState ({
            showMessage : !showMessage,
        })
    }

    // показываем окно "О компании"
    showModalAbout = () => {
        this.setState({
            visibleAbout: true,
        });
    };

    // закрываем окно "О компании"
    handleCancelAbout = () => {
        this.setState({
            visibleAbout: false,
        });
    };
    



    render() {
        const { loadingStatus, checkCookies, showMessage } = this.state;
        
        // загружаем данные с сервера
       if (!checkCookies) return <LoadingScreen />;
        
        
       if (typeof this.props.owner.chUID === 'undefined') {
        return <Redirect to="/login"/>
       } 
       
       
       if (this.props.owner.chName.length === 0) {
            return <Redirect to="/setup"/>
        }

        return (
            <Layout style={{ minHeight: '100vh' }}>
                <SiderMenu/>
                <СheckNewOrder/>
                <Layout>
                    <Content style={{ width: 840 }}>
                    
                        { (this.props.owner.blVerification === "0") && (this.props.owner.iStaffType === "0") ? <div style={{ padding: "16px 16px 0 16px" }}><Alert 
                                    message="E-mail не подтверждён." 
                                    closable 
                                    type="warning" 
                                    style={{ margin: '0', textAlign: "center" }} 
                                    closeText="Отправить письмо ещё раз" 
                                    afterClose={this.sendMailVerification}
                                    className="alert-order"/> </div> : null }
                                    
                  
                    <div style={{ padding: !showMessage ? 16 : "0px 16px 16px 16px", minHeight: 360 }}>
                        <Route exact path="/" component={Dashboard}/>
                        <Route exact path="/categories" component={Categories}/>
                        <Route exact path="/option-sets" component={OptionSets}/>
                        <Route exact path="/dishes" component={Dishes}/>
                        <Route exact path="/variants" component={Menus}/>
                        <Route exact path="/orders" component={Orders}/>
                        <Route exact path="/customers" component={Clients}/>
                        <Route exact path="/locations" component={Locations}/>
                        <Route exact path="/sorting" component={Sorting}/>
                        <Route exact path="/tags" component={Tags}/>
                        <Route exact path="/stock" component={Stock}/>
                        <Route exact path="/push" component={Push}/>
                        <Route exact path="/staff" component={Staff}/>
                        <Route exact path="/general-settings" component={GeneralSettings}/>
                        <Route exact path="/times" component={Times}/>
                        <Route exact path="/type-order" component={TypeOrder}/>
                        <Route exact path="/payment" component={Payment}/>
                        <Route exact path="/email-notifications" component={EmailNotifications}/>
                        <Route exact path="/auto-execution" component={AutoExecution}/>
                        <Route exact path="/customisation" component={Customisation}/>
                        <Route exact path="/information" component={Information}/>
                        <Route exact path="/license" component={License}/>
                        <Route exact path="/application" component={Application}/>
                    </div>
                    </Content>
                    <Footer style={{ textAlign: 'center', color: '#bfbfbf', fontSize: 12 }}>
                        Deliveryserv ©2019 | <a href="#" onClick={this.showModalAbout} className="LinkCopyright">О компании</a>
                        <ModalAbout 
                            visible = {this.state.visibleAbout}
                            handleCancel = {this.handleCancelAbout}
                        />
                    </Footer>
                </Layout>
            </Layout> 
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
