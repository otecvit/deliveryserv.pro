import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Layout, Menu, Icon, Modal} from 'antd';
import Cookies from 'js-cookie'

const { Sider } = Layout;
const SubMenu = Menu.SubMenu;
const confirm = Modal.confirm;

class SiderMenu extends Component {
    state = {
        collapsed: false,
    }

    onCollapse = (collapsed) => {
        this.setState (
            {collapsed}
        );
    }

    onClickMenu = (e) => {
       
        if (e.key === "/logout") { // проверяем "Выход"
            
            Cookies.remove('cookiename');
            this.props.onLogout(); // выход
            //this.showLogout()
        };
    }

    showLogout = () => {
        confirm({
          title: 'Вы действительно хотите выйти?',
          content: 'После выходы Вы сможете авторизоваться в любое удобное время',
          okText: 'Да',
          cancelText: 'Нет',
          onOk() {
           // this.props.onLogout(); // выход
          },
          onCancel() {
            
          },
        });
      }

    checkAccess = (page) => {
        
    }

    render() {
        const IconFont = Icon.createFromIconfontCN({
            scriptUrl: this.props.optionapp[0].scriptIconUrl,
          });

        return (
            <Sider
                collapsible
                collapsed={this.state.collapsed}
                onCollapse={this.onCollapse}
            >
            {this.props.owner.chPathLogo.length ? <div className={ !this.state.collapsed ? "logo" : "collapsedLogo" }><img src = {this.props.owner.chPathLogo} /></div> : <div className="noLogo"></div> }
            <Menu theme="dark" selectedKeys={[this.props.routing.location.pathname]} mode="inline" onClick={this.onClickMenu}>
                { (this.props.owner.iStaffType === "0" || this.props.owner.arrAccess["dashboard"]) && <Menu.Item key="/"><Link to="/"><Icon type="home" /><span>Рабочий стол</span></Link></Menu.Item> }
                { (this.props.owner.iStaffType === "0" || this.props.owner.arrAccess["orders"]) && 
                    <Menu.Item key="/orders">
                        <Link to="orders"><IconFont type="icon-orders"/>
                            <span>Заказы</span>
                        </Link>
                    </Menu.Item> }
                { (this.props.owner.iStaffType === "0" || this.props.owner.arrAccess["customers"]) && <Menu.Item key="/customers"><Link to="customers"><Icon type="team" /><span>Клиенты</span></Link></Menu.Item> }
                { (this.props.owner.iStaffType === "0" || this.props.owner.arrAccess["locations"]) && <Menu.Item key="/locations"><Link to="locations"><Icon type="environment" /><span>Адреса</span></Link></Menu.Item> }
                <SubMenu key="sub1" title={<span><IconFont type="icon-cutlery"/><span>Ассортимент</span></span>}>
                    { (this.props.owner.iStaffType === "0" || this.props.owner.arrAccess["variants"]) && <Menu.Item key="/variants"><Link to="variants">Варианты</Link></Menu.Item> }
                    { (this.props.owner.iStaffType === "0" || this.props.owner.arrAccess["categories"]) && <Menu.Item key="/categories"><Link to="categories">Категории</Link></Menu.Item> }
                    { (this.props.owner.iStaffType === "0" || this.props.owner.arrAccess["dishes"]) && <Menu.Item key="/dishes"><Link to="dishes">Товары</Link></Menu.Item> }
                    { (this.props.owner.iStaffType === "0" || this.props.owner.arrAccess["option-sets"]) && <Menu.Item key="/option-sets"><Link to="option-sets">Наборы</Link></Menu.Item> }
                    { (this.props.owner.iStaffType === "0" || this.props.owner.arrAccess["tags"]) && <Menu.Item key="/tags"><Link to="tags">Теги</Link></Menu.Item> }
                    { (this.props.owner.iStaffType === "0" || this.props.owner.arrAccess["sorting"]) && <Menu.Item key="/sorting"><Link to="sorting">Сортировка</Link></Menu.Item> }
                </SubMenu>
                    { (this.props.owner.iStaffType === "0" || this.props.owner.arrAccess["staff"]) && <Menu.Item key="/staff"><Link to="staff"><IconFont type="icon-employees_icon" /><span>Сотрудники</span></Link></Menu.Item> }
                <SubMenu key="sub2" title={<span><IconFont type="icon-marketing"></IconFont><span>Маркетинг</span></span>}>    
                    { (this.props.owner.iStaffType === "0" || this.props.owner.arrAccess["stock"]) && <Menu.Item key="/stock"><Link to="stock"><span>Акции</span></Link></Menu.Item> }
                    { (this.props.owner.iStaffType === "0" || this.props.owner.arrAccess["push"]) && <Menu.Item key="/push"><Link to="push"><span>Push-уведомления</span></Link></Menu.Item> }
                </SubMenu>
                <SubMenu key="sub3" title={<span><Icon type="setting"/><span>Настройки</span></span>}>
                    { (this.props.owner.iStaffType === "0" || this.props.owner.arrAccess["general-settings"]) && <Menu.Item key="/general-settings"><Link to="general-settings">Общие</Link></Menu.Item> }
                    { (this.props.owner.iStaffType === "0" || this.props.owner.arrAccess["type-order"]) && <Menu.Item key="/type-order"><Link to="type-order">Типы заказов</Link></Menu.Item> }
                    { (this.props.owner.iStaffType === "0" || this.props.owner.arrAccess["times"]) && <Menu.Item key="/times"><Link to="times">Время</Link></Menu.Item> }
                    { (this.props.owner.iStaffType === "0" || this.props.owner.arrAccess["payment"]) && <Menu.Item key="/payment"><Link to="payment">Оплата</Link></Menu.Item> }
                    { (this.props.owner.iStaffType === "0" || this.props.owner.arrAccess["email-notifications"]) && <Menu.Item key="/email-notifications"><Link to="email-notifications">E-mail уведомления</Link></Menu.Item> }
                    { (this.props.owner.iStaffType === "0" || this.props.owner.arrAccess["auto-execution"]) && <Menu.Item key="/auto-execution"><Link to="auto-execution">Автовыполнение</Link></Menu.Item> }
                    { (this.props.owner.iStaffType === "0" || this.props.owner.arrAccess["customisation"]) && <Menu.Item key="/customisation"><Link to="customisation">Оформление</Link></Menu.Item> }
                    { (this.props.owner.iStaffType === "0" || this.props.owner.arrAccess["information"]) && <Menu.Item key="/information"><Link to="information">Информация</Link></Menu.Item> }
                    { (this.props.owner.iStaffType === "0" || this.props.owner.arrAccess["application"]) && <Menu.Item key="/application"><Link to="application">Приложение</Link></Menu.Item> }
                </SubMenu>
                { (this.props.owner.iStaffType === "0" || this.props.owner.arrAccess["license"]) && <Menu.Item key="/license"><Link to="license"><Icon type="credit-card" /><span>Оплата</span></Link></Menu.Item> }
                <Menu.Item key="/logout"><Icon type="logout" /><span>Выход</span></Menu.Item>
            </Menu>
            </Sider>
        );        
    }
}
export default connect (
    state => ({
        optionapp: state.optionapp,
        owner: state.owner,
        routing: state.routing,
    }),
    dispatch => ({
        onLogout: () => {
            dispatch({ type: 'LOGOUT_OWNER'});
          },
    }
  ))(SiderMenu);



