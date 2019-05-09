import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Layout, Tabs, Avatar, Icon, Table, Menu, Dropdown, Pagination, Col, Row, message, Popconfirm, Modal, Alert  } from 'antd';
import moment from 'moment';

import { PrintOrder } from '../../items/PDFPrint'
import OrdersForm from './OrdersForm'
import HeaderSection from '../../items/HeaderSection'
import ViewDetailDescription from '../../items/ViewDetailDescription'

const { Content } = Layout;
const PAGE_HITS = 'hitsPerPage=';
const CURRENT_PAGE = 'defaultCurrentPage=';

class Orders extends Component {
    
    constructor(props) {
        super(props);
        this.handler = this.handler.bind(this)

        this.state = {
            dataSource: [],
            newOrderCount: this.props.optionapp[0].newOrderCount,
            flLoading: true,
            showOrders: false,
            openDropMenu: false,
            hitsPerPage: 10,
            defaultCurrentPage: 1,
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
    }

    createDropdownMenu = (record) => {
        const menu = (
            <Menu onClick={e => {
                this.handleMenuClick(e, record);
            }}>
              <Menu.Item key="0">Печать заказа</Menu.Item>
              <Menu.Divider />
              <Menu.Item key="1">Заказ подтвержден</Menu.Item>
              <Menu.Item key="2">Заказ выполнен</Menu.Item>
              <Menu.Divider />
              <Menu.Item key="3">Заказ отменен</Menu.Item>
            </Menu>
          );
   
        return menu;
    }

    handleMenuClick = (e, record) => {
        switch (e.key) {
            case "0": this.handlePrintOrder(record); break; //Отправляем на печать
            case "1": console.log("1"); break; //Копировать
            case "2": console.log("2"); break; 
            default: console.log("3");;    
        }
        this.setState({
            openDropMenu: false,
        });
      }

    handlePrintOrder = ({record}) => {
        
        const url = this.props.optionapp[0].serverUrl + "/SelectOrdersDetail.php";

        fetch(url, 
          {
              method: 'POST',
              body: JSON.stringify(
              {
                idOrder: record.idOrder
             })
          })
        .then((response) => response.json())
        .then((responseJson) => {
           PrintOrder(record, responseJson.ordersdetail, this.props.owner.chCurrency);
        })
        .catch((error) => {
          console.error(error);
        });

        
    }


    loadingData = () => {

        const { hitsPerPage, defaultCurrentPage } = this.state;
        const url = `${this.props.optionapp[0].serverUrl}/SelectOrders.php?${PAGE_HITS}${hitsPerPage}&${CURRENT_PAGE}${defaultCurrentPage}`;
        
        this.setState({
            flLoading: true,
        })

        fetch(url, {
            method: 'POST',
            body: JSON.stringify(
            {
              chUID: this.props.owner.chUID,
            })
          })
        .then((response) => response.json())
        .then((responseJson) => {
            this.props.onAdd(responseJson.orders);
            this.setState({
                dataSource: responseJson.orders,
                flLoading: false,
            });
            this.props.onControlOrder({
                NewOrderPrint: "0"                                                                                                         ,
            });
            this.CalculatePlaced();
        })
        .catch((error) => {
          console.error(error);
        });
    }

    // изменение номера страницы
    onChangePageNumber = (pageNumber) => {
        this.setState({
            defaultCurrentPage: pageNumber,
        }, () => this.loadingData())
    }

    // изменение количества записей на странице
    onShowSizeChange = (currentPage, pageSize) => {
        this.setState({
            defaultCurrentPage: currentPage,
            hitsPerPage: pageSize,
        }, () => this.loadingData())
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
            this.val = record;
            this.setState({
                showOrders: !this.state.showOrders,
            });
     }

    styleRow = (record) => {
        switch (record.iStatus) {
            case "0": return 'border-status-0'; // не подтвержден 
            case "1": return 'border-status-1'; // не подтвержден 
            case "2": return 'border-status-2'; // не подтвержден 
            case "3": return 'border-status-3'; // не подтвержден 
            case "4": return 'border-status-4'; // не подтвержден 
            case "5": return 'border-status-5'; // не подтвержден 
            case "6": return 'border-status-6'; // не подтвержден 
        };
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
        const { dataSource, defaultCurrentPage, flLoading } = this.state;

        const columns = [{ 
                title: 'Тип', 
                dataIndex: 'iStatus',
                key: 'type', 
                render: (record) => {
                    var color = '#efbb1e';
                    switch (record) {
                        case "0": color = '#efbb1e'; break; // не подтвержден и не просмотрен
                        case "1": color = '#efbb1e'; break; // не подтвержден 
                        case "2": color = '#b7d024'; break; // подтвердил
                        case "3": color = '#0080ff'; break; // готов
                        case "4": color = '#00bfff'; break; // в пути
                        case "5": color = '#51a351'; break; // выполнен
                        case "6": color = '#bd362f'; break; // отменен
                    };

                    return (
                        <div style={{ textAlign: 'center' }}>
                            <Avatar style={{ backgroundColor: color, verticalAlign: 'middle'}} size="large"><IconFont type="icon-Delivery_" style={{ fontSize: '25px', color: "#fff" }}/></Avatar>
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
                    return (
                    <div style={{ textAlign: 'center' }}>
                        {moment(record, "DD.MM.YYYY HH:mm", true).isValid() ? 
                        <div>
                            <div style={{ fontSize: '16px' }}>к {record.split(' ')[1]}</div>
                            <div style={{ fontSize: '13px' }}>{record.split(' ')[0]}</div>
                        </div> : 
                        <div style={{ fontSize: '13px' }}>{record}</div>}
                    </div>);
                }
            },{ 
                title: 'Время заказа', 
                dataIndex: 'chCalcPlaced', 
                render: (record) => {
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
                    return (
                    <div style={{ textAlign: 'center', fontSize: '15px', fontWeight: 'bold' }}>
                           {Number(record).toFixed(2)} {this.props.owner.chCurrency} 
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
                        case "1": chStatus = 'Не подтвержден'; break; // не подтвержден 
                        case "2": chStatus = 'Подтвержден'; break; // Подтвержден
                        case "3": chStatus = 'Приготовлен'; break; // готов
                        case "4": chStatus = 'В пути'; break; // в пути
                        case "5": chStatus = 'Выполнен'; break; // выполнен
                        case "6": chStatus = 'Отменен'; break; // отменен
                    };

                    return (
                        <div style={{ textAlign: 'center', fontSize: '13px' }}>
                            {chStatus}
                        </div>
                    )
                }
            },{ 
                title: 'Действие', 
                key: 'operation', 
                fixed: 'right', 
                width: 100, 
                render: (record) => 
                <div style={{ textAlign: 'center' }}>
                    <Dropdown overlay={this.createDropdownMenu({record})} onVisibleChange={this.onOpenDropMenu} trigger={['click']}>
                        <a className="ant-dropdown-link" href="#">
                            <IconFont type="icon-menu1" style={{ fontSize: "18px", color: "#000000a6" }}/>
                        </a>
                    </Dropdown>
                </div>
            },
        ];

        const IconFont = Icon.createFromIconfontCN({
            scriptUrl: this.props.optionapp[0].scriptIconUrl,
          });


        //const options = this.props.dishes.map(item => <Option key={item.idDishes}>{item.chName}</Option>);

        return (<div>
            <HeaderSection title="Заказы" icon="icon-orders" />
            <Content style={{ background: '#fff', margin: '16px 0' }}>
                <div style={{ padding: 10 }}>
                
                { this.props.owner.NewOrderPrint !== "0" ? <Alert 
                                        message={`${this.props.owner.NewOrderPrint} ${this.declOfNum(['новый заказ','новых заказа','новых заказов'])(this.props.owner.NewOrderPrint)}`} 
                                        closable 
                                        type="info" 
                                        style={{ margin: '16px 0', textAlign: "center" }} 
                                        closeText="Обновить список" 
                                        afterClose={this.loadingData}
                                        className="alert-order"/> : null }
                <Table
                            columns={columns}
                            dataSource={dataSource}
                            size="small"  
                            pagination={false}
                            loading={flLoading}
                            onRow={(record, index) => ({
                                onClick: (event) => { this.onRowClick(record, index, event) } 
                              })}
                            rowClassName={(record) => {return this.styleRow(record)}}
                            locale={{emptyText: 'Нет данных'}}
                            
    
                        />
                
                    <Row style={{ padding: 20, textAlign: "center" }}>
                        <Col span={24}>
                        { dataSource.length !== 0 &&
                            <Pagination 
                                showSizeChanger 
                                defaultCurrent={defaultCurrentPage} 
                                total={+this.props.owner.CountOrder} 
                                onChange={this.onChangePageNumber}
                                onShowSizeChange={this.onShowSizeChange}
                            />
                        }
                        </Col>
                    </Row>
                 
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
        owner: state.owner,
    }),
    dispatch => ({
        onAdd: (data) => {
            dispatch({ type: 'LOAD_ORDERS_ALL', payload: data});
          },
        onControlOrder: (data) => {
            dispatch({ type: 'RESET_NEW_ORDER_FOR_PRINT', payload: data});
          },
    })
  )(Orders);