import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Layout, Tabs, Input, Icon, Table, Menu, Dropdown, Form, Select, message, Popconfirm, Modal, Alert  } from 'antd';

const { Content } = Layout;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const confirm = Modal.confirm;

const generateKey = (pre) => {
    return `${ new Date().getTime() }`;
  }

class Dishes extends Component {
    
    constructor(props) {
        super(props);
        //this.handler = this.handler.bind(this)

        this.state = {
            dataSource: [],
            newOrderCount: this.props.optionapp[0].newOrderCount,
            flLoading: true,
        };
    }

    componentDidMount() {
        this.loadingData();
    }

    createDropdownMenu = (record) => {
        const menu = (
            <Menu /*onClick={e => this.handleMenuClick(e, record)}*/>
              <Menu.Item key="0">Редактировать</Menu.Item>
              <Menu.Item key="1">Копировать</Menu.Item>
              <Menu.Item key="2"> Удалить </Menu.Item>
            </Menu>
          );
        return menu;
    }

    loadingData = () => {
        //const proxyurl = "https://cors-anywhere.herokuapp.com/";
        const url = "http://mircoffee.by/deliveryserv/app/SelectOrders.php";

        fetch(url)
        .then((response) => response.json())
        .then((responseJson) => {
            //this.checkCountOrder(responseJson.orders_count);
            console.log(responseJson.orders);
            this.setState({
                dataSource: responseJson.orders,
                flLoading: false,
            })
        })
        .catch((error) => {
          console.error(error);
        });
    }

    render() {
        const { dataSource, newOrderCount, flLoading } = this.state;
        const columns = [{ 
                title: 'Тип', 
                dataIndex: 'iStatus',
                key: 'type', 
                render: (record) => {
                    var color = '#efbb1e';
                    switch (record) {
                        case "0": color = '#efbb1e'; break; // не подтвержден 
                        case "1": color = '#b7d024'; break; // подтвердил
                        case "2": color = '#0080ff'; break; // готов
                        case "3": color = '#00bfff'; break; // в пути
                        case "4": color = '#51a351'; break; // выполнен
                        case "5": color = '#bd362f'; break; // отменен
                    };

                    return <IconFont type="icon-delivery" style={{ fontSize: '36px', color: color }}/>
                }
            },{ 
                title: 'idOrder', 
                dataIndex: 'idOrder', 
            },{ 
                title: 'Номер заказа', 
                dataIndex: 'chNameOrder', 
            },{ 
                title: 'Имя клиента', 
                dataIndex: 'chNameClient', 
            },{ 
                title: 'Ко времени', 
                dataIndex: 'chDue', 
            },{ 
                title: 'Время заказа', 
                dataIndex: 'chPlaced', 
            },{ 
                title: 'Сумма заказа', 
                dataIndex: 'chTotal', 
            },{ 
                title: 'Статус', 
                dataIndex: 'iStatus', 
                key: 'iStatus',
            },{ 
                title: 'Ресторан', 
                dataIndex: 'chLocation', 
            },{ 
                title: 'Действие', 
                key: 'operation', 
                fixed: 'right', 
                width: 100, 
                render: (record) => 
                <div style={{ textAlign: 'center' }}>
                    <Dropdown overlay={this.createDropdownMenu({record})} trigger={['click']}>
                        <a className="ant-dropdown-link" href="#">
                            <Icon type="ellipsis" style={{ transform: "rotate(90deg)" }} />
                        </a>
                    </Dropdown>
                </div>
            },
        ];

        const IconFont = Icon.createFromIconfontCN({
            scriptUrl: '//at.alicdn.com/t/font_888138_wkh5ogmpzia.js',
          });


        //const options = this.props.dishes.map(item => <Option key={item.idDishes}>{item.chName}</Option>);

        return (<div>
            <Content style={{ background: '#fff'}}>
                <div style={{ padding: 10 }}>
                    Заказы
                </div>
            </Content>
            
            <Content style={{ background: '#fff', margin: '16px 0' }}>
                <div style={{ padding: 10 }}>
                
                { newOrderCount ? <Alert message="Error Text" type="error" style={{ margin: '16px 0', textAlign: 'center' }} /> : null }
                <Table
                            columns={columns}
                            dataSource={dataSource}
                            size="small"  
                            pagination={false}
                            loading={flLoading}
                            onRow={(record, index) => ({
                                onClick: (event) => { /*onRowClick(record, index, event)*/ } 
                              })}
    
                        />
                </div>
            </Content>
            </div>);        
    }
}

export default connect (
    state => ({
        orders: state.orders,
        optionapp: state.optionapp,
    }),
    dispatch => ({
        onDeleteCategory: (optionSetsData) => {
            confirm({
                title: 'Удалить набор опций?',
                content: 'Будет удален набор опций',
                onOk() {
                    dispatch({ type: 'DELETE_OPTION_SETS', payload: optionSetsData});
                    message.success('Набор опций удален'); 
                },
              });
        },
    })
  )(Dishes);