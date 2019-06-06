import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import { Layout, Tabs, Input, Icon, Table, Menu, Dropdown, Form, Select, Row, Col, Modal } from 'antd';

import MenusForm from './MenusForm';
import HeaderSection from '../../items/HeaderSection'
import ViewDetailDescription from '../../items/ViewDetailDescription'

const { Content } = Layout;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const confirm = Modal.confirm;

const generateKey = (pre) => {
    return `${ new Date().getTime() }`;
  }

class Menus extends Component {
    
    constructor(props) { 
        super(props);
        this.handler = this.handler.bind(this)

        this.state = {
          searchString: '',
          activeKey: "1", 
          statusJobRecord: "0", // 0 - создание, 1 - редактирование, 2 - копирование
          currentEditRecord: {},
          filtered: false,
          dataSource: [],
          flLoading: true, // спиннер загрузки
        };
    }

    componentDidMount() {
        this.loadingData();
    }

    loadingData = () => {
        const url = this.props.optionapp[0].serverUrl + "/SelectMenus.php";
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
            this.props.onAdd(responseJson.menus);
            this.setState({
                dataSource: responseJson.menus,
                flLoading: false,
            });
        })
        .catch((error) => {
          console.error(error);
        });

        const urlCategories = this.props.optionapp[0].serverUrl + "/SelectCategories.php";
        this.setState({
            flLoading: true,
        })
        fetch(urlCategories, {
            method: 'POST',
            body: JSON.stringify(
            {
              chUID: this.props.owner.chUID,
            })
          })
        .then((response) => response.json())
        .then((responseJson) => {
            this.props.onAddCategories(responseJson.categories);
            this.setState({
                flLoading: false,
            });
        })
        .catch((error) => {
          console.error(error);
        });

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

    // Редактирование
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

    delete = ({record: {idMenus}}, path, _this) => {
        confirm({
            title: 'Вы действительно хотите удалить вариант?',
            okText: 'Да',
            okType: 'danger',
            cancelText: 'Нет',
            onOk() {
                const url = path + "/DeleteMenus.php"; // удаление
                fetch(url,
                {
                    method: 'POST',
                    body: JSON.stringify(
                    {
                        idMenus: idMenus
                    })
                }).then((response) => response.json()).then((responseJsonFromServer) =>
                {
                    var val = {
                        idMenus: idMenus
                    }
                    _this.props.onDelete(val);  // вызываем action
                }).catch((error) =>
                {
                    console.error(error);
                });
            },
          });
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
    

    onChangeSearchString = (e) => { 
        const reg = new RegExp(e.target.value, 'gi');
        this.setState({ 
            searchString: e.target.value,
            filtered: !!e.target.value,
            dataSource: this.props.menus.map((record) => {
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

    onChangeDishes = (e) => {
        this.setState ({ 
            currentEditRecord: this.props.menus.find(x => x.idMenus === e.key),
            statusJobRecord: "1",
        });
    }

    dayOfWeekAsString = (dayIndex) => {
        return ["Понедельник","Вторник","Среда","Четверг","Пятница","Суббота","Воскресенье"][dayIndex - 1];
      }
    
    render() {

        const { searchString, currentEditRecord, statusJobRecord, dataSource, flLoading } = this.state;
        const suffix = searchString ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null;
        
        const columns = [{ 
                title: 'Имя', 
                dataIndex: 'idMenus', 
                key: 'name', 
                render: (record) => {
                    //console.log(dataSource);
                    var chName = "";
                    var chNamePrint = "";

                    if (dataSource.length) {
                        chName = this.props.menus.find(x => x.idMenus ===  record).chName;
                        chNamePrint = this.props.menus.find(x => x.idMenus ===  record).chNamePrint;
                    }
                    
                    return (<div>{chName}</div>);
                }
            },{ 
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


        const options = this.props.menus.map(item => <Option key={item.idMenus}>{item.chName}</Option>);
        const IconFont = Icon.createFromIconfontCN({
            scriptUrl: this.props.optionapp[0].scriptIconUrl,
          });

        return (<Fragment>
            <HeaderSection title="Варианты" icon="icon-menu" />
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
                            expandedRowRender={({enShow, chDescription, blDays, arrDays, blTimes, chStartInterval, chEndInterval, arrCategories}) => 
                            <Fragment>
                                <ViewDetailDescription title="Активность" value={enShow === 'true' ? "Да" : "Нет"} />
                                <ViewDetailDescription title="Описание" value={chDescription} />
                                <ViewDetailDescription title="Категории" value={
                                    arrCategories.map((idCategories, index) => {
                                        return (
                                            <Row key={index}>
                                                <Col span={24}>{this.props.categories.find(x => x.idCategories ===  idCategories).chName }</Col>
                                             </Row>
                                        ) 
                                    })
                                } />
                                <ViewDetailDescription title="Дни недели" value={
                                    blDays === "true" ? "Ежедневно" :
                                     arrDays.map((day, index) => {
                                        return (
                                                <Row key={index}>
                                                    <Col span={24}>{["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"][day-1]}</Col>
                                                 </Row>
                                    ) 
                                    })} />
                                <ViewDetailDescription title="Время действия" value={
                                    blTimes === "true" ? "Постоянно" :
                                        <Row>
                                            <Col span={24}>c {chStartInterval} по {chEndInterval}</Col>
                                        </Row>
                                    } />
                            </Fragment>
                            }
                            dataSource={!this.state.filtered ? this.props.menus : dataSource}
                            size="small"  
                            pagination={false}
                            loading={flLoading}
                            locale={{emptyText: 'Нет данных'}}
                        />,            
                    </TabPane>
                    <TabPane tab="Создать" key="2">
                        <MenusForm handler = {this.handler} param={currentEditRecord} type={statusJobRecord}/>
                    </TabPane>
                    <TabPane tab="Редактировать" key="3">
                        <Select
                        showSearch
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        onChange={this.onChangeDishes}
                        style={{ width: "100%" }}
                        labelInValue 
                        value={{ key: typeof currentEditRecord.idMenus !== "undefined" ? currentEditRecord.idMenus : "0" }}
                        >
                        <Option key="0">Выберите вариант для редактирования</Option>
                        {options}
                    </Select>
                    { statusJobRecord === "1"  ? <MenusForm handler = {this.handler} param={currentEditRecord} type={statusJobRecord}/> : null }
                    </TabPane>
                    <TabPane tab="Сортировка" key="4">
                    </TabPane>
                </Tabs>
                </div>
            </Content>
            </Fragment>);        
    }
}

export default connect (
    state => ({
        menus: state.menus,
        categories: state.categories,
        optionapp: state.optionapp,
        owner: state.owner,
    }),
    dispatch => ({
        onAdd: (data) => {
            dispatch({ type: 'LOAD_MENUS_ALL', payload: data});
          },
        onAddCategories: (data) => {
            dispatch({ type: 'LOAD_CATEGORIES_ALL', payload: data});
          },
        onDelete: (data) => {
            dispatch({ type: 'DELETE_MENUS', payload: data});
          },
    })
  )(Menus);