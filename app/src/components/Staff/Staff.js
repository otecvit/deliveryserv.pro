import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Layout, Tabs, Input, Icon, Table, Menu, Dropdown, Form, Select, Row, Col, Modal } from 'antd';

import StaffForm from './StaffForm';
import HeaderSection from '../../items/HeaderSection'
import ViewDetailDescription from '../../items/ViewDetailDescription'
import { arrPageAccess } from '../../constans'

const { Content } = Layout;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const confirm = Modal.confirm;

const generateKey = (pre) => {
    return `${ new Date().getTime() }`;
  }
  

class Staff extends Component {
    constructor(props) {
        super(props);
        this.handler = this.handler.bind(this)

        this.state = {
          searchString: '',
          activeKey: "1",
          currentEditRecord: {},
          statusJobRecord: "0", // 0 - создание, 1 - редактирование, 2 - копирование
          filtered: false,
          dataSource: {},
          flLoading: true, // спиннер загрузки
        };
    }

    handleMenuClick = (e, record) => {
        var _this = this; // делаем ссылку на объект
        switch (e.key) {
            case "0": this.edit(record); break; //Редактировать
            case "1": this.copy(record); break; //Копировать
            case "2": this.delete(record, this.props.optionapp[0].serverUrl, _this); break;  // передаеи путь на сервере и ссылку на объект
            default: this.setState({
                activeKey: "1",
                statusJobRecord: "0"
            });
        }        
      }

    edit = ({record}) => {
        this.setState({
            activeKey: "3",
            statusJobRecord: "1",
            currentEditRecord: record,
        });
    }

    copy = ({record}) => {
        // открываем вкладку копирования
        this.setState({
            activeKey: "2",
            statusJobRecord: "2",
            currentEditRecord: record,
        });
    }


    /// Удаление 
    delete = ({record: {idStaff}}, path, _this) => {
        confirm({
            title: 'Вы действительно хотите удалить сотрудника?',
            okText: 'Да',
            okType: 'danger',
            cancelText: 'Нет',
            onOk() {
                const url = path + "/DeleteStaff.php"; // удаление
                fetch(url,
                {
                    method: 'POST',
                    headers: 
                    {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(
                    {
                        idStaff: idStaff
                    })
                }).then((response) => response.json()).then((responseJsonFromServer) =>
                {
                    var val = {
                        idStaff: idStaff
                    }
                    _this.props.onDelete(val);  // вызываем action
                }).catch((error) =>
                {
                    console.error(error);
                });
            },
          });
    }


    componentDidMount() {
        this.loadingData();
    }

    // обрабатываем нажатие на суффикс "крестик"
    emitEmpty = () => {
        this.searchStringInput.focus(); //
        this.setState({ 
            searchString: '' , // удаляем поисковый запрос
            filtered: false, // сброс фильтрации
        });
    }

    handler = () => {
        this.setState({
            currentEditRecord: {},
            statusJobRecord: "0",
        });
      }

    loadingData = () => {
        const url = this.props.optionapp[0].serverUrl + "/SelectStaff.php";
        this.setState({
            flLoading: true,
        })
        fetch(url, {
            method: 'POST',
            headers: 
            {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
            {
              chUIDStaff: this.props.owner.chUIDStaff,
            })
          })
        .then((response) => response.json())
        .then((responseJson) => {
                        
            this.props.onAdd(responseJson.staff);
            this.setState({
                dataSource: responseJson.staff,
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
            dataSource: this.props.staff.map((record) => {
                if (record.chName.length)
                { 
                const match = record.chName.match(reg);
            
                if (!match) {
                return null;
                }
                return {
                ...record,
                chName: (
                    <span>
                    {record.chName.split(reg).map((text, i) => (
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
        this.setState({
            currentEditRecord: {},
            statusJobRecord: "0",
        }); 
    }

    createDropdownMenu = (record) => {
        const menu = (
            <Menu onClick={e => this.handleMenuClick(e, record)}>
              <Menu.Item key="0">Редактировать</Menu.Item>
              <Menu.Item key="1">Копировать</Menu.Item>
              <Menu.Item key="2"> Удалить </Menu.Item>
            </Menu>
          );
        
        return menu;
    }

    onChangeEditRecord = (e) => {
        this.setState ({ 
            currentEditRecord: this.props.staff.find(x => x.idStaff === e.key),
            statusJobRecord: "1",
        });
    }

    render() {

        const { searchString, statusJobRecord, currentEditRecord, dataSource, flLoading } = this.state;
        const suffix = searchString ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null;
        const columns = [
            { title: 'Имя', dataIndex: 'chName', key: 'name' },
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

        const IconFont = Icon.createFromIconfontCN({
            scriptUrl: this.props.optionapp[0].scriptIconUrl,
          });             

        const options = this.props.staff.map(item => <Option key={item.idStaff}>{item.chName}</Option>);

        return (<div>
            <HeaderSection title="Сотрудники" icon="icon-employees_icon" />
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
                            expandedRowRender={({ arrAccess }) => 
                            <Fragment>
                                <ViewDetailDescription title="Доступ к разделам" value={
                                    arrPageAccess.map((PageAccess, index) => {
                                        return (
                                                <Row key={index}>
                                                    <Col span={12}>{PageAccess.name}</Col>
                                                    <Col span={12}>{arrAccess[PageAccess.keyName] ? "Да" : "Нет"}</Col>
                                                </Row>)
                                    }) 
                                    } 
                                />
                            </Fragment>
                            }
                            dataSource={!this.state.filtered ? this.props.staff : dataSource}
                            size="small"  
                            pagination={false}
                            loading={flLoading}
                            locale={{emptyText: 'Нет данных'}}

                        />,            
                    </TabPane>
                    <TabPane tab="Создать" key="2">
                        <StaffForm handler = {this.handler} param={currentEditRecord} type={statusJobRecord}/>
                    </TabPane>
                    <TabPane tab="Редактировать" key="3">
                        <Select
                        showSearch
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        onChange={this.onChangeEditRecord}
                        style={{ width: "100%" }}
                        labelInValue 
                        value={{ key: typeof currentEditRecord.idStaff !== "undefined" ? currentEditRecord.idStaff : "0" }}
                        >
                        <Option key="0">Выберите сотрудника для редактирования</Option>
                        {options}
                    </Select>
                    { statusJobRecord === "1" ? <StaffForm handler = {this.handler} param={currentEditRecord} type={statusJobRecord}/> : null }
                    </TabPane>
                </Tabs>
                </div>
            </Content>
        </div>);
    }
}

export default connect (
    state => ({
        optionapp: state.optionapp,
        owner: state.owner,
        staff: state.staff
    }),
    dispatch => ({
        onAdd: (data) => {
            dispatch({ type: 'LOAD_STAFF_ALL', payload: data});
          },
        onDelete: (data) => {
            dispatch({ type: 'DELETE_STAFF', payload: data});
        },
    })
  )(Staff);

    