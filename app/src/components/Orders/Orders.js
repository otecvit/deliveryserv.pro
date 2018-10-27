import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Layout, Tabs, Input, Icon, Table, Menu, Dropdown, Form, Select, message, Popconfirm, Modal, Alert  } from 'antd';
import moment from 'moment';

import OrdersForm from './OrdersForm';

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
        this.handler = this.handler.bind(this)

        this.state = {
            dataSource: [],
            newOrderCount: this.props.optionapp[0].newOrderCount,
            flLoading: true,
            showOrders: false,
            openDropMenu: false,
        };
    }

    componentDidMount() {
        this.loadingData();
        this.timer = setInterval(()=> this.getItems(), 10000);
    }

  
    componentWillUnmount() {
        this.timer = null; // here...
    }
      
    getItems = () => {
        this.CalculatePlaced();
        /*
        fetch(this.getEndpoint('api url endpoint"))
          .then(result => result.json())
          .then(result => this.setState({ items: result }));
          */
    }

    createDropdownMenu = (record) => {
        const menu = (
            <Menu onClick={e => {
      
                
                this.handleMenuClick(e, record);
            }}>
              <Menu.Item key="0">Редактировать</Menu.Item>
              <Menu.Item key="1">Копировать</Menu.Item>
              <Menu.Item key="2"> Удалить </Menu.Item>
            </Menu>
          );
   
        return menu;
    }

    handleMenuClick = (e, record) => {
        switch (e.key) {
            case "0": console.log("0"); break; //Редактировать
            case "1": console.log("1"); break; //Копировать
            case "2": console.log("2"); break; 
            default: console.log("3");;    
        }

        console.log("handleMenuClick");
        console.log("false");
        this.setState({
            openDropMenu: false,
        });
      }


    loadingData = () => {
        //const proxyurl = "https://cors-anywhere.herokuapp.com/";
        const url = "http://mircoffee.by/deliveryserv/app/SelectOrders.php";

        this.setState({
            flLoading: true,
        })

        fetch(url)
        .then((response) => response.json())
        .then((responseJson) => {
            //this.checkCountOrder(responseJson.orders_count);
            //console.log(responseJson.orders);
            this.props.onAdd(responseJson.orders);
            this.setState({
                dataSource: responseJson.orders,
                flLoading: false,
            });

            this.CalculatePlaced();
        })
        .catch((error) => {
          console.error(error);
        });
    }

    CalculatePlaced = () => {
        const { dataSource } = this.state;
        this.setState({
            dataSource: dataSource.map( item => {
                var b = new Date(
                    item.dDateOrder[0], 
                    item.dDateOrder[1]-1, 
                    item.dDateOrder[2],  
                    item.dDateOrder[3],  
                    item.dDateOrder[4],  
                    item.dDateOrder[5],  
                    0); // 
                const newData = {
                    chCalcPlaced: String(this.get_whole_values(b)),
                }
                return {...item, ...newData};
            }),
        });
    }

    /// определяем сколько прошло времени
    get_whole_values = (base_value) => {
        let curr_date = new Date(); // Current date now.
        let time_fractions = [1000, 60, 60];
        let time_data = [curr_date - base_value];
        for (let i = 0; i < time_fractions.length; i++) {
            time_data.push(parseInt(time_data[i]/time_fractions[i]));
            time_data[i] = time_data[i] % time_fractions[i];
        }; 
        if (time_data[3] >= 24) return ('0' + base_value.getDate()).slice(-2) + '.' + ('0' + (base_value.getMonth()+1)).slice(-2) + '.' +  base_value.getFullYear() + ' ' + base_value.toTimeString().split(' ')[0];
        if (time_data[3] > 0) return `${time_data[3]} ${this.declOfNum(['час','часа','часов'])(time_data[3])} часа назад`;
        if (time_data[2] > 0) return `${time_data[2]} ${this.declOfNum(['минуту','минуты','минут'])(time_data[2])} назад`;
        if (time_data[1] > 0) return `${time_data[1]} ${this.declOfNum(['секунду','секунды','секунд'])(time_data[1])} назад`;

        return ('0' + base_value.getDate()).slice(-2) + '.' + ('0' + (base_value.getMonth()+1)).slice(-2) + '.' +  base_value.getFullYear() + ' ' + base_value.toTimeString().split(' ')[0];
    };//////////////////////////////

    // склонение числительных
    declOfNum = (titles) => {
        var number = Math.abs(number);
        var cases = [2, 0, 1, 1, 1, 2];
        return function(number){
            return  titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
        }
    };/////////

    onRowClick = (record, index, event) => {
            console.log(record);
            console.log(index);
            console.log(event);

            console.log("onRowClick");
            this.val = record;
            this.setState({
                showOrders: !this.state.showOrders,
            });
     }

    handler = () => {
        //e.preventDefault()
        this.setState({
            showOrders: false,
            dataSource: this.props.orders,
        });
      }

      onOpenDropMenu = (flag) => {
          this.setState({
              openDropMenu: flag,
          })         

          if (this.state.openDropMenu) {
            this.setState({
                showOrders: !this.state.showOrders
            }) 
          }
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

                    return (
                        <div style={{ textAlign: 'center' }}>
                            <IconFont type="icon-delivery" style={{ fontSize: '36px', color: color }}/>
                        </div>
                    )
                }
            },{ 
                title: '№ Заказа / Клиент', 
                dataIndex: 'chNameOrder', 
                render: (record) => {
                    const chNameClient = dataSource.find(x => x.chNameOrder ===  record).chNameClient
                    
                    return (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '17px', fontWeight: 'bold' }}>{record}</div>
                        <div>{chNameClient}</div>
                    </div>);
                }
            },{ 
                title: 'Номер телефона', 
                dataIndex: 'chPhone', 
                render: (record) => {
                    return (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '13px' }}>{record}</div>
                    </div>);
                }
            },{ 
                title: 'Ко времени', 
                dataIndex: 'chDue', 
                render: (record) => {
                    //moment("06/22/2015", "MM/DD/YYYY", true).isValid(); // true
                    return (
                    <div style={{ textAlign: 'center' }}>
                        {moment(record, "DD.MM.YYYY HH:mm", true).isValid() ? 
                        <div>
                            <div style={{ fontSize: '13px' }}>к {record.split(' ')[1]}</div>
                            <div style={{ fontSize: '13px' }}>{record.split(' ')[0]}</div>
                        </div> : 
                        <div style={{ fontSize: '13px' }}>{record}</div>}
                    </div>);
                }
            },{ 
                title: 'Время заказа', 
                dataIndex: 'chCalcPlaced', 
                render: (record) => {
                    //moment("06/22/2015", "MM/DD/YYYY", true).isValid(); // true
                    return (
                    <div style={{ textAlign: 'center' }}>
                        {moment(record, "DD.MM.YYYY HH:mm:ss", true).isValid() ? 
                        <div>
                            <div style={{ fontSize: '13px' }}>{record.split(' ')[1]}</div>
                            <div style={{ fontSize: '13px' }}>{record.split(' ')[0]}</div>
                        </div> : 
                        <div style={{ fontSize: '13px' }}>{record}</div>}
                    </div>);
                }
            },{ 
                title: 'Сумма заказа', 
                dataIndex: 'chOrderPrice', 
                render: (record) => {
                    //moment("06/22/2015", "MM/DD/YYYY", true).isValid(); // true
                    return (
                    <div style={{ textAlign: 'center', fontSize: '15px', fontWeight: 'bold' }}>
                           {record} BYN
                    </div>);
                }
            },{ 
                title: 'Статус', 
                dataIndex: 'iStatus', 
                key: 'iStatus',
                render: (record) => {
                    var chStatus = 'Не подтвержден';
                    switch (record) {
                        case "0": chStatus = 'Не подтвержден'; break; // не подтвержден 
                        case "1": chStatus = 'Подтвержден'; break; // Подтвержден
                        case "2": chStatus = 'Приготовлен'; break; // готов
                        case "3": chStatus = 'В пути'; break; // в пути
                        case "4": chStatus = 'Выполнен'; break; // выполнен
                        case "5": chStatus = 'Отменен'; break; // отменен
                    };

                    return (
                        <div style={{ textAlign: 'center', fontSize: '13px' }}>
                            {chStatus}
                        </div>
                    )
                }
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
                    <Dropdown overlay={this.createDropdownMenu({record})} onVisibleChange={this.onOpenDropMenu} trigger={['click']}>
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
                                onClick: (event) => { this.onRowClick(record, index, event) } 
                              })}
                            rowClassName={(record, index) => {
                                return 'sssss';  
                              }}
    
                        />
                {this.state.showOrders && !this.state.openDropMenu ? <OrdersForm handler = {this.handler} param={this.val}/> : null}
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
        onAdd: (data) => {
            dispatch({ type: 'LOAD_ORDERS_ALL', payload: data});
          },
    })
  )(Dishes);