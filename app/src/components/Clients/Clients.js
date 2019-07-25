import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import { Layout, Tabs, Avatar , Icon, Table, Menu, Button, Row, Col, Select, Pagination, Popconfirm, Modal, Alert  } from 'antd';
import moment from 'moment';
import { Link } from 'react-router-dom';

import ClientsForm from './ClientsForm'
import HeaderSection from '../../items/HeaderSection'
import { numberWithSpaces } from '../../function/functions'

const { Content } = Layout;
const PAGE_HITS = 'hitsPerPage=';
const CURRENT_PAGE = 'defaultCurrentPage=';

const generateKey = (pre) => {
    return `${ new Date().getTime() }`;
  }

class Customers extends Component {
    
    constructor(props) {
        super(props);
        this.handler = this.handler.bind(this)

        this.state = {
            dataSource: [],
            flLoading: true,
            showOrders: false,
            openDropMenu: false,
            hitsPerPage: 10,
            defaultCurrentPage: 1,
        };
    }

    componentDidMount() {
        this.loadingData();
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
        this.setState({
            openDropMenu: false,
        });
      }


    loadingData = () => {

        const { hitsPerPage, defaultCurrentPage } = this.state;
        const url = `${this.props.optionapp[0].serverUrl}/SelectClients.php?${PAGE_HITS}${hitsPerPage}&${CURRENT_PAGE}${defaultCurrentPage}`;

        this.setState({
            flLoading: true,
        })

        fetch(url, {
            method: 'POST',
            body: JSON.stringify(
            {
              chUID: this.props.owner.chUID,
              chTimeZone: this.props.owner.chTimeZone,
            })
          })
        .then((response) => response.json())
        .then((responseJson) => {
            this.props.onAdd(responseJson.clients);
            this.setState({
                dataSource: responseJson.clients,
                flLoading: false,
            });
            this.props.onControlOrder({
                newOrderCount: 0,
            });
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
    
    getColorAvatar = (e) => {
        
    }

    render() {
        const { dataSource, defaultCurrentPage, flLoading } = this.state;
        const columns = [{ 
                title: '', 
                dataIndex: 'idClient',
                key: 'avatar', 
                render: (record) => {
                    const chFIO = dataSource.find(x => x.idClient ===  record).chFIO;
                    const chColorAvatar = dataSource.find(x => x.idClient ===  record).chColorAvatar;

                    return (
                        <div style={{ textAlign: 'center' }}>
                            <Avatar shape="square" style={{ color: '#fff', fontWeight: "500", verticalAlign: 'middle', backgroundColor: `#${chColorAvatar}`  }}>
                                {chFIO.length ? ` ${chFIO.charAt(0).toUpperCase()}` : <Icon type="user" theme="outlined" />}
                            </Avatar>
                        </div> 
                    )
                }
            },{ 
                title: 'Клиент', 
                dataIndex: 'chFIO', 
                render: (record) => {
                    //const chNameClient = dataSource.find(x => x.chNameOrder ===  record).chNameClient
                    
                    return (
                    <div style={{ textAlign: 'center' }}>{record}</div>);
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
                title: 'Регистрация', 
                dataIndex: 'dDateRegistration',
                width: 100,
                render: (record) => {
                    //moment("06/22/2015", "MM/DD/YYYY", true).isValid(); // true
                    return (
                    <div style={{ textAlign: 'center' }}>
                        {record}
                    </div>);
                }
            },{ 
                title: 'Количество заказов', 
                dataIndex: 'countOrder', 
                width: 100,
                render: (record) => {
                    //moment("06/22/2015", "MM/DD/YYYY", true).isValid(); // true
                    return (
                    <div style={{ textAlign: 'center', fontSize: '15px', fontWeight: 'bold' }}>
                           {Number(record).toFixed(0)}
                    </div>);
                }
            },{ 
                title: 'Сумма заказов', 
                dataIndex: 'sumOrder', 
                width: 200,
                render: (record) => {
                    //moment("06/22/2015", "MM/DD/YYYY", true).isValid(); // true
                    return (
                    <div style={{ textAlign: 'center', fontSize: '15px', fontWeight: 'bold' }}>
                           {numberWithSpaces(Number(record).toFixed(2))} {this.props.owner.chCurrency}
                    </div>);
                }
            },{ 
                title: 'Последний заказа', 
                dataIndex: 'dLastOrder', 
                width: 100,
                render: (record) => {
                    return (
                    <div style={{ textAlign: 'center' }}>
                            {record}
                    </div>);
                }
            },
        ];

        return (<Fragment>
            <HeaderSection title="Клиенты" icon="icon-team" />
            { this.props.owner.blStatusCustomer  ? 
                <Content style={{ background: '#fff', margin: '16px 0' }}>
                    <div style={{ padding: 10 }}>
                    <Table
                                columns={columns}
                                dataSource={dataSource}
                                size="small"  
                                pagination={false}
                                loading={flLoading}
                                onRow={(record, index) => ({
                                    onClick: (event) => { this.onRowClick(record, index, event) } 
                                })}
                                rowClassName="cursor-pointer"
                                locale={{emptyText: 'Нет данных'}}
        
                            />
                                        <Row style={{ padding: 20, textAlign: "center" }}>
                        <Col span={24}>
                        { dataSource.length !== 0 &&
                            <Pagination 
                                showSizeChanger 
                                defaultCurrent={defaultCurrentPage} 
                                total={+this.props.owner.CountCustomers} 
                                onChange={this.onChangePageNumber}
                                onShowSizeChange={this.onShowSizeChange}
                            />
                        }
                        </Col>
                    </Row>

                    {this.state.showOrders && !this.state.openDropMenu ? <ClientsForm handler = {this.handler} param={this.val}/> : null}
                    </div>
                </Content> : 
                <Content style={{ margin: '16px 0' }}>
                <Alert
                    message="Период действия подписки закончился"
                    description={
                        <Fragment>
                            <Row>
                                <Col span={24}>
                                Купите подписку, чтобы продолжить работать.
                                </Col>
                            </Row>
                            <Row style={{ marginTop: 10 }}>
                                <Col span={24}>
                                    <Link to="license"><Button type="primary">Купить</Button></Link>
                                </Col>
                            </Row>
                        </Fragment>}
                    type="warning"
                    showIcon 
                />
            </Content>}
            </Fragment>);        
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
            dispatch({ type: 'LOAD_CUSTOMERS_ALL', payload: data}); 
          },
        onControlOrder: (data) => {
            dispatch({ type: 'EDIT_OPTIONAPP_CONTROL_ORDER', payload: data});
          },
    })
  )(Customers);