import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Layout, Tabs, Avatar , Icon, Table, Menu, Dropdown, Row, Col, Select, message, Popconfirm, Modal, Alert  } from 'antd';
import moment from 'moment';

import ClientsForm from './ClientsForm';

const { Content } = Layout;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const confirm = Modal.confirm;

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
        //this.CalculatePlaced();
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
        this.setState({
            openDropMenu: false,
        });
      }


    loadingData = () => {
        //const proxyurl = "https://cors-anywhere.herokuapp.com/";
        const url = this.props.optionapp[0].serverUrl + "/SelectClients.php";

        this.setState({
            flLoading: true,
        })

        fetch(url)
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
        const { dataSource, newOrderCount, flLoading } = this.state;
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
                render: (record) => {
                    //moment("06/22/2015", "MM/DD/YYYY", true).isValid(); // true
                    return (
                    <div style={{ textAlign: 'center', fontSize: '15px', fontWeight: 'bold' }}>
                           {Number(record).toFixed(2)} BYN
                    </div>);
                }
            },{ 
                title: 'Последний заказа', 
                dataIndex: 'dLastOrder', 
                render: (record) => {
                    //moment("06/22/2015", "MM/DD/YYYY", true).isValid(); // true
                    return (
                    <div style={{ textAlign: 'center' }}>
                            {record}
                    </div>);
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
            <Content style={{ background: '#fff'}}>
                <div style={{ padding: 10 }}>
                    <div className="title-section"><Icon type="team" style={{ fontSize: '20px', marginRight: "10px"}}/>Клиенты</div>
                </div>
            </Content>
            
            <Content style={{ background: '#fff', margin: '16px 0' }}>
                <div style={{ padding: 10 }}>
                
                { this.props.optionapp[0].newOrderCount ? <Alert 
                                        message={`${this.props.optionapp[0].newOrderCount} ${this.declOfNum(['новый заказ','новых заказа','новых заказов'])(this.props.optionapp[0].newOrderCount)}`} 
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
                            rowClassName="cursor-pointer"
    
                        />
                {this.state.showOrders && !this.state.openDropMenu ? <ClientsForm handler = {this.handler} param={this.val}/> : null}
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
            dispatch({ type: 'LOAD_CUSTOMERS_ALL', payload: data});
          },
        onControlOrder: (data) => {
            dispatch({ type: 'EDIT_OPTIONAPP_CONTROL_ORDER', payload: data});
          },
    })
  )(Customers);