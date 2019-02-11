import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Layout, Menu, Icon, Modal } from 'antd';
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
       
        if (e.key === "20") { // проверяем "Выход"
            
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
            <div className="logo" />
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" onClick={this.onClickMenu}>
                { (this.props.owner.iStaffType === "0" || this.props.owner.arrAccess["dashboard"]) && <Menu.Item key="1"><Link to="/"><Icon type="home" /><span>Рабочий стол</span></Link></Menu.Item> }
                { (this.props.owner.iStaffType === "0" || this.props.owner.arrAccess["orders"]) && <Menu.Item key="2"><Link to="orders"><IconFont type="icon-orders"/><span>Заказы</span></Link></Menu.Item> }
                { (this.props.owner.iStaffType === "0" || this.props.owner.arrAccess["customers"]) && <Menu.Item key="3"><Link to="customers"><Icon type="team" /><span>Клиенты</span></Link></Menu.Item> }
                { (this.props.owner.iStaffType === "0" || this.props.owner.arrAccess["locations"]) && <Menu.Item key="4"><Link to="locations"><Icon type="environment" /><span>Рестораны</span></Link></Menu.Item> }
                <SubMenu key="sub1" title={<span><IconFont type="icon-cutlery"/><span>Меню</span></span>}>
                    { (this.props.owner.iStaffType === "0" || this.props.owner.arrAccess["menus"]) && <Menu.Item key="5"><Link to="menus">Меню</Link></Menu.Item> }
                    { (this.props.owner.iStaffType === "0" || this.props.owner.arrAccess["categories"]) && <Menu.Item key="6"><Link to="categories">Категории</Link></Menu.Item> }
                    { (this.props.owner.iStaffType === "0" || this.props.owner.arrAccess["dishes"]) && <Menu.Item key="7"><Link to="dishes">Товары</Link></Menu.Item> }
                    { (this.props.owner.iStaffType === "0" || this.props.owner.arrAccess["option-sets"]) && <Menu.Item key="8"><Link to="option-sets">Наборы</Link></Menu.Item> }
                    { (this.props.owner.iStaffType === "0" || this.props.owner.arrAccess["sorting"]) && <Menu.Item key="10"><Link to="sorting">Сортировка</Link></Menu.Item> }
                </SubMenu>
                    { (this.props.owner.iStaffType === "0" || this.props.owner.arrAccess["staff"]) && <Menu.Item key="11"><Link to="staff"><Icon type="idcard" /><span>Сотрудники</span></Link></Menu.Item> }
                <SubMenu key="sub2" title={<span><IconFont type="icon-marketing"></IconFont><span>Маркетинг</span></span>}>    
                    { (this.props.owner.iStaffType === "0" || this.props.owner.arrAccess["stock"]) && <Menu.Item key="12"><Link to="stock"><Icon type="gift" /><span>Акции</span></Link></Menu.Item> }
                    { (this.props.owner.iStaffType === "0" || this.props.owner.arrAccess["push"]) && <Menu.Item key="21"><Link to="stock"><IconFont type="icon-push" /><span>Push-сообщения</span></Link></Menu.Item> }
                </SubMenu>
                <SubMenu key="sub3" title={<span><Icon type="setting"/><span>Настройки</span></span>}>
                    { (this.props.owner.iStaffType === "0" || this.props.owner.arrAccess["general-settings"]) && <Menu.Item key="13"><Link to="general-settings">Общие</Link></Menu.Item> }
                    { (this.props.owner.iStaffType === "0" || this.props.owner.arrAccess["type-order"]) && <Menu.Item key="14"><Link to="type-order">Типы заказов</Link></Menu.Item> }
                    { (this.props.owner.iStaffType === "0" || this.props.owner.arrAccess["times"]) && <Menu.Item key="15"><Link to="times">Время</Link></Menu.Item> }
                    { (this.props.owner.iStaffType === "0" || this.props.owner.arrAccess["sorting"]) && <Menu.Item key="16">Оплата</Menu.Item> }
                    { (this.props.owner.iStaffType === "0" || this.props.owner.arrAccess["sorting"]) && <Menu.Item key="17">Оформление</Menu.Item> }
                    { (this.props.owner.iStaffType === "0" || this.props.owner.arrAccess["sorting"]) && <Menu.Item key="18">Правила</Menu.Item> }
                </SubMenu>
                { (this.props.owner.iStaffType === "0" || this.props.owner.arrAccess["sorting"]) && <Menu.Item key="19"><Icon type="credit-card" /><span>Оплата</span></Menu.Item> }
                <Menu.Item key="20"><Icon type="logout" /><span>Выход</span></Menu.Item>
            </Menu>
            </Sider>
        );        
    }
}
export default connect (
    state => ({
        optionapp: state.optionapp,
        owner: state.owner,
    }),
    dispatch => ({
        onLogout: () => {
            dispatch({ type: 'LOGOUT_OWNER'});
          },
    }
  ))(SiderMenu);



