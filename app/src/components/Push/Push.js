import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout, Tabs, Input, Icon, Table, Menu, Dropdown, message} from 'antd';
import moment from 'moment';

import PushForm from './PushForm';
import HeaderSection from '../../items/HeaderSection'

const { Content } = Layout;
const TabPane = Tabs.TabPane;

const generateKey = (pre) => {
    return `${ new Date().getTime() }`;
}

class Push extends Component {
    constructor(props) {
        super(props);
        this.handler = this.handler.bind(this)
        this.state = {
          searchString: '',
          activeKey: "1",
          currentEditCat: "0",
          currentRecord: [],
          filtered: false,
          dataSource: {},
          flLoading: true, // спиннер загрузки
        };
    }

    // Обрабатываем нажатие на контекстное меню записи
    handleMenuClick = (e, record) => {
        switch (e.key) {
            case "0": this.RepeatSend(record); break; //Повторить отправку сообщения
            case "1": this.Delete(record); break; //Удалить сообщение из списка
            default: this.setState({activeKey: "1"});    
        }      
    }

    RepeatSend = (e) => {
        var val = {};
        const url = this.props.optionapp[0].serverUrl + "/EditPushNotification.php"; // добавляем категорию
        fetch(url, {
          method: 'POST',
          headers: 
          {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(
          {
            idPush: e.record.idPush,
          })
        }).then((response) => response.json()).then((responseJsonFromServer) => {
          val = {
              idPush: e.record.idPush,
              dDateLastSending: moment().format('DD.MM.YYYY HH:mm'),
          }
          this.props.onEdit(val);  // вызываем action
        }).catch((error) => {
            console.error(error);
        });
    
        const urlPushSending = this.props.optionapp[0].serverUrlStart + "/SendPushMessage.php"; // добавляем категорию
        fetch(urlPushSending, {
          method: 'POST',
          headers: 
          {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(
          {
            chUID: this.props.owner.chUID,
            chTitlePush: e.record.chTitlePush,
            chTextPush: e.record.chTextPush,
          })
        }).then((response) => response.json()).then((responseJsonFromServer) => {
          message.success("Push-уведомление успешно отправлено");
        }).catch((error) => {
            console.error(error);
        });
    }

    Delete = (e) => {
        const url = this.props.optionapp[0].serverUrl + "/DeletePushNotification.php"; // удаление
        fetch(url,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idPush: e.record.idPush,
                })
            }).then((response) => response.json()).then((responseJsonFromServer) =>
            {
                this.props.onDelete({idPush: e.record.idPush});  // вызываем action
                message.success("Push-уведомление удалено");
            }).catch((error) => {
                console.error(error);
            });
    }

    componentDidMount() {
        this.loadingData();
    }

    emitEmpty = () => {
        this.searchStringInput.focus();
        this.setState({ 
            filtered: !this.state.filtered,
            searchString: '' });
    }

    handler = () => {
        this.setState({
            currentEditCat: "0",
        });
    }

    loadingData = () => {

        const url = this.props.optionapp[0].serverUrl + "/SelectPushNotification.php";
        this.setState({
            flLoading: true,
        })
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chUID: this.props.owner.chUID,
            })
            })
        .then((response) => response.json())
        .then((responseJson) => {
            this.props.onAdd(responseJson.pushNotification);
            this.setState({
                dataSource: responseJson.pushNotification,
                flLoading: false,
            });
        })
        .catch((error) => {
            console.error(error);
        });
    }


    onChangeSearchString = (e) => { 
        const reg = new RegExp(e.target.value, 'gi');
        this.setState({ 
            searchString: e.target.value,
            filtered: !!e.target.value,
            dataSource: this.props.pushNotification.map((record) => {
                if (record.chTitlePush.length)
                { 
                const match = record.chTitlePush.match(reg);
            
                if (!match) {
                return null;
                }
                return {
                ...record,
                chTitlePush: (
                    <span>
                    {record.chTitlePush.split(reg).map((text, i) => (
                        i > 0 ? [<span className="highlight" key={generateKey()}>{match[0]}</span>, text] : text
                    ))}
                    </span>
                ),
                };
            }
            }).filter(record => !!record), 
        });
    }

    onChange = (activeKey) => {
        this.setState({ activeKey });
    }

    createDropdownMenu = (record) => {
        const menu = (
            <Menu onClick={e => this.handleMenuClick(e, record)}>
              <Menu.Item key="0">Повторить отправку</Menu.Item>
              <Menu.Item key="1">Удалить</Menu.Item>
            </Menu>
          );
        return menu;
    }

    render() {

        const { searchString, dataSource, flLoading } = this.state;
        const suffix = searchString && <Icon type="close-circle" onClick={this.emitEmpty} />;
        
        const IconFont = Icon.createFromIconfontCN({
            scriptUrl: this.props.optionapp[0].scriptIconUrl,
          }); 

        const columns = [
            { title: 'Заголовок', dataIndex: 'chTitlePush', key: 'name' },
            { 
                title: 'Действие', 
                key: 'operation', 
                width: 100, 
                render: (record) => 
                <div style={{ textAlign: 'center' }}>
                    <Dropdown overlay={this.createDropdownMenu({record})} trigger={['click']}>
                        <a className="ant-dropdown-link" href="#">
                            <IconFont type="icon-menu1" style={{ fontSize: "18px", color: "#000000a6" }}/>
                        </a>
                    </Dropdown>
                </div>
          },
        ];

                    

        return (<div>
        <HeaderSection title="Push-уведомления" icon="icon-push"/>
        <Content style={{ background: '#fff', margin: '16px 0' }}>
            <div style={{ padding: 10 }}>
            <Tabs 
                onChange={this.onChange}
                activeKey={this.state.activeKey}>
                <TabPane tab="Обзор" key="1">
                    <Input
                        placeholder="Поиск"
                        prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        suffix={suffix}
                        value={searchString}
                        onChange={this.onChangeSearchString}
                        ref={node => this.searchStringInput = node}
                        style={{ margin: '0 0 10px 0' }}
                    />    
                    <Table
                        columns={columns}
                        expandedRowRender={record => 
                            <div className="d-table">
                                <div className="d-tr">
                                    <div className="d-td title-detail">Текст уведомления</div>
                                    <div className="d-td content-detail">{record.chTextPush}</div>
                                </div>                                
                                <div className="d-tr">
                                    <div className="d-td title-detail">Дата последней отправки</div>
                                    <div className="d-td content-detail">{record.dDateLastSending}</div>
                                </div>
                            </div>
                        }
                        dataSource={!this.state.filtered ? this.props.pushNotification : dataSource}
                        size="small"  
                        pagination={false}
                        loading={flLoading}
                        locale={{emptyText: 'Нет данных'}}

                    />,            
                </TabPane>
                <TabPane tab="Создать" key="2">
                    <PushForm copyrecord={this.state.currentRecord}/>
                </TabPane>
            </Tabs>
            </div>
        </Content>
        </div>);
    }
}

export default connect (
    state => ({
        pushNotification: state.pushNotification,
        optionapp: state.optionapp,
        owner: state.owner,
    }),
    dispatch => ({
        onAdd: (data) => {
            dispatch({ type: 'LOAD_PUSH_ALL', payload: data});
          },
        onDelete: (data) => {
            dispatch({ type: 'DELETE_PUSH', payload: data});
        },
        onEdit: (data) => {
            dispatch({type: 'EDIT_PUSH', payload: data})
        }
    })
  )(Push);

