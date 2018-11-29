import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';
const { Sider } = Layout;
const SubMenu = Menu.SubMenu;

class SiderMenu extends Component {
    state = {
        collapsed: false,
    }

    onCollapse = (collapsed) => {
        this.setState (
            {collapsed}
        );
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
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                <Menu.Item key="1"><Link to="/"><Icon type="home" /><span>Рабочий стол</span></Link></Menu.Item>
                <Menu.Item key="2"><Link to="orders"><IconFont type="icon-orders"/><span>Заказы</span></Link></Menu.Item>
                <Menu.Item key="3"><Link to="customers"><Icon type="team" /><span>Клиенты</span></Link></Menu.Item>
                <Menu.Item key="4"><Link to="locations"><Icon type="environment" /><span>Рестораны</span></Link></Menu.Item>
                <SubMenu key="sub1" title={<span><IconFont type="icon-cutlery"/><span>Меню</span></span>}>
                    <Menu.Item key="5"><Link to="menus">Меню</Link></Menu.Item>
                    <Menu.Item key="6"><Link to="categories">Категории</Link></Menu.Item>
                    <Menu.Item key="7"><Link to="dishes">Товары</Link></Menu.Item>
                    <Menu.Item key="8"><Link to="option-sets">Наборы</Link></Menu.Item>
                    <Menu.Item key="10"><Link to="sorting">Сортировка</Link></Menu.Item>
                </SubMenu>
                <Menu.Item key="11"><Icon type="idcard" /><span>Сотрудники</span></Menu.Item>
                <Menu.Item key="12"><Link to="stock"><Icon type="gift" /><span>Акции</span></Link></Menu.Item>
                <SubMenu key="sub2" title={<span><Icon type="setting"/><span>Настройки</span></span>}>
                    <Menu.Item key="13">Общие</Menu.Item>
                    <Menu.Item key="14">Типы заказов</Menu.Item>
                    <Menu.Item key="15">Время</Menu.Item>
                    <Menu.Item key="16">Оплата</Menu.Item>
                    <Menu.Item key="17">Оформление</Menu.Item>
                    <Menu.Item key="18">Правила</Menu.Item>
                </SubMenu>
                <Menu.Item key="19"><Icon type="credit-card" /><span>Оплата</span></Menu.Item>
                <Menu.Item key="20"><Icon type="logout" /><span>Выход</span></Menu.Item>
            </Menu>
            </Sider>
        );        
    }
}
export default connect (
    state => ({
        optionapp: state.optionapp,
    }),
  )(SiderMenu);



