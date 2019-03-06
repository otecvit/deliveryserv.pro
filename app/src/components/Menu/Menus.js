import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Layout, Tabs, Input, Icon, Table, Menu, Dropdown, Form, Select, message, Popconfirm, Modal } from 'antd';

import MenusForm from './MenusForm';

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
          currentEditOptionSets: "0",
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
            headers: 
            {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
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
        fetch(urlCategories)
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
        switch (e.key) {
            case "0": this.editCategory(record); break; //Редактировать
            case "1": this.setState({activeKey: "2"}); break; //Копировать
            case "2": this.DeleteCategory(record); break; 
            default: this.setState({activeKey: "1"});    
        }        
      }

    editCategory = (e) => {
        this.setState({
            activeKey: "3",
            currentEditOptionSets: e.record.idDishes,
        });

    }

    DeleteCategory = (e) => {
        var val = {
            idDishes: e.record.idDishes,
        }
        this.props.onDeleteCategory(val);  // вызываем action
               
    }

    emitEmpty = () => {
        this.searchStringInput.focus();
        this.setState({ searchString: '' });
    }

    handler = () => {
        this.setState({
            currentEditOptionSets: "0",
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
    }

    createDropdownMenu = (record) => {

        //console.log(record);
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
            currentEditOptionSets: e.key
        });
    }

    dayOfWeekAsString = (dayIndex) => {
        return ["Понедельник","Вторник","Среда","Четверг","Пятница","Суббота","Воскресенье"][dayIndex - 1];
      }
    
    render() {

        const { searchString, currentEditOptionSets, dataSource, flLoading } = this.state;
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
                    
                    return (<div>{chNamePrint.length ? chNamePrint : chName}</div>);
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

        return (<div>
            <Content style={{ background: '#fff'}}>
                <div style={{ padding: 10 }}>
                <div className="title-section"><IconFont type="icon-menu" style={{ fontSize: '16px', marginRight: "10px"}}/>Варианты</div>
                </div>
            </Content>
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
                                        <div className="d-td title-detail">Активность</div>
                                        <div className="d-td content-detail">{record.enShow === "true" ? "Да" : "Нет"}</div>
                                    </div>                                    
                                    <div className="d-tr">
                                        <div className="d-td title-detail">Имя</div>
                                        <div className="d-td content-detail">{record.chName}</div>
                                    </div>
                                    <div className="d-tr">
                                        <div className="d-td title-detail">Описание</div>
                                        <div className="d-td content-detail">{record.chDescription}</div>
                                    </div>
                                    <div className="d-tr">
                                        <div className="d-td title-detail">Категории</div>
                                        <div className="d-td content-detail">{ record.arrCategories.map((item, index) => <div key={index}>{this.props.categories.find(x => x.idCategories ===  item).chName}</div>)}</div>
                                    </div>                                    
                                    <div className="d-tr">
                                        <div className="d-td title-detail">Дни недели</div>
                                        <div className="d-td content-detail">{record.blDays === "true" ? "Ежедневно" : record.arrDays.map((item, index) => <div key={index}>{this.dayOfWeekAsString(item)}</div>)}</div>
                                    </div>
                                    <div className="d-tr">
                                        <div className="d-td title-detail">Время действич</div>
                                        <div className="d-td content-detail">{record.blTimes === "true" ? "Постоянно" : `С ${record.chStartInterval} по ${record.chEndInterval}`} </div>
                                    </div>
                                </div>
                                }
                            dataSource={!this.state.filtered ? this.props.menus : dataSource}
                            size="small"  
                            pagination={false}
                            loading={flLoading}
                            locale={{emptyText: 'Нет данных'}}
    
    
                        />,            
                    </TabPane>
                    <TabPane tab="Создать" key="2">
                        <MenusForm/>
                    </TabPane>
                    <TabPane tab="Редактировать" key="3">
                        <Select
                        showSearch
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        onChange={this.onChangeDishes}
                        style={{ width: "100%" }}
                        labelInValue 
                        value={{ key: currentEditOptionSets }}
                        >
                        <Option key="0">Выберите блюдо для редактирования</Option>
                        {options}
                    </Select>
                    { currentEditOptionSets === "0" ? null : <MenusForm handler = {this.handler} param={currentEditOptionSets} /> }
                    </TabPane>
                </Tabs>
                </div>
            </Content>
            </div>);        
    }
}

export default connect (
    state => ({
        menus: state.menus,
        optionapp: state.optionapp,
        categories: state.categories,
        owner: state.owner
    }),
    dispatch => ({
        onAdd: (data) => {
            dispatch({ type: 'LOAD_MENUS_ALL', payload: data});
          },
        onAddCategories: (data) => {
            dispatch({ type: 'LOAD_CATEGORIES_ALL', payload: data});
          },
    })
  )(Menus);