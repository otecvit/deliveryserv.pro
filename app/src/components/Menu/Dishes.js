import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Layout, Tabs, Input, Icon, Table, Menu, Dropdown, Form, Select, message, Popconfirm, Modal } from 'antd';

import DishesForm from './DishesForm';

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
          searchString: '',
          activeKey: "1",
          currentEditOptionSets: "0",
          currentRecord: [],
          filtered: false,
          dataSource: {},
          flLoading: true, // спиннер загрузки
        };
    }

    handleMenuClick = (e, record) => {
        switch (e.key) {
            case "0": this.editCategory(record); break; //Редактировать
            case "1": this.copyDishes(record); break; //Копировать
            case "2": this.DeleteCategory(record); break; 
            default: this.setState({activeKey: "1"});    
        }        
    }

    copyDishes = (e) => {
        // открываем вкладку копирования
        this.setState({
            activeKey: "2",
            currentRecord: e.record,
        });
    }

    componentDidMount() {
        this.loadingData();
        
    }

    loadingData = () => {

        const url = this.props.optionapp[0].serverUrl + "/SelectProducts.php";
        this.setState({
            flLoading: true,
        })
        fetch(url)
        .then((response) => response.json())
        .then((responseJson) => {
            this.props.onAdd(responseJson.dishes);
            this.setState({
                dataSource: responseJson.dishes,
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

        const urlOptionSets = this.props.optionapp[0].serverUrl + "/SelectOptionSets.php";
        this.setState({
            flLoading: true,
        })
        fetch(urlOptionSets)
        .then((response) => response.json())
        .then((responseJson) => {
            this.props.onAddOptionSets(responseJson.optionsets);
            this.setState({
                flLoading: false,
            });
        })
        .catch((error) => {
          console.error(error);
        });

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
            dataSource: this.props.dishes.map((record) => {
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
    
    render() {

        const { searchString, currentEditOptionSets, dataSource, flLoading } = this.state;
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

        const options = this.props.dishes.map(item => <Option key={item.idDishes}>{item.chName}</Option>);
        const IconFont = Icon.createFromIconfontCN({
            scriptUrl: this.props.optionapp[0].scriptIconUrl,
          });

        return (<div>
            <Content style={{ background: '#fff'}}>
                <div style={{ padding: 10 }}>
                    <div className="title-section"><IconFont type="icon-cutlery" style={{ fontSize: '20px', marginRight: "10px"}}/>Товары</div>
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
                                        <div className="d-td title-detail">Категория</div>
                                        <div className="d-td content-detail">{this.props.categories.find(x => x.idCategories ===  record.iCategories).chName}</div>
                                    </div>
                                    <div className="d-tr">
                                        <div className="d-td title-detail">Отображаемое имя</div>
                                        <div className="d-td content-detail">{record.chNamePrint}</div>
                                    </div>
                                    <div className="d-tr">
                                        <div className="d-td title-detail">Подзаголовок</div>
                                        <div className="d-td content-detail">{record.chSubtitle}</div>
                                    </div>
                                    <div className="d-tr">
                                        <div className="d-td title-detail">Цена</div>
                                        <div className="d-td content-detail">{record.chPrice}</div>
                                    </div>
                                    <div className="d-tr">
                                        <div className="d-td title-detail">Старая цена</div>
                                        <div className="d-td content-detail">{record.chOldPrice}</div>
                                    </div>
                                    <div className="d-tr">
                                        <div className="d-td title-detail">Описание</div>
                                        <div className="d-td content-detail">{record.chDescription}</div>
                                    </div>
                                    <div className="d-tr">
                                        <div className="d-td title-detail">Набор</div>
                                        <div className="d-td content-detail">{record.chOptionSets !== "0" ? this.props.optionsets.find(x => x.idOptionSets ===  record.chOptionSets).chName : ""}</div>
                                    </div>
                                    <div className="d-tr">
                                        <div className="d-td title-detail">Тэги</div>
                                        <div className="d-td content-detail"></div>
                                    </div>
                                    <div className="d-tr">
                                        <div className="d-td title-detail">Ингридиенты</div>
                                        <div className="d-td content-detail">{record.ingredients.map((item, index) => <div key={index}>{item.chName}</div>)}</div>
                                    </div>
                                </div>
                                }
                            dataSource={!this.state.filtered ? this.props.dishes : dataSource}
                            size="small"  
                            pagination={false}
                            loading={flLoading}
                            locale={{emptyText: 'Нет данных'}}
    
                        />            
                    </TabPane>
                    <TabPane tab="Создать" key="2">
                        <DishesForm copyrecord={this.state.currentRecord}/>
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
                    { currentEditOptionSets === "0" ? null : <DishesForm handler = {this.handler} param={currentEditOptionSets} /> }
                    </TabPane>
                 </Tabs>
                </div>
            </Content>
            </div>);        
    }
}

export default connect (
    state => ({
        dishes: state.dishes,
        categories: state.categories,
        optionsets: state.optionSets,
        optionapp: state.optionapp,
    }),
    dispatch => ({
        onAdd: (data) => {
            dispatch({ type: 'LOAD_DISHES_ALL', payload: data});
          },
        onAddCategories: (data) => {
            dispatch({ type: 'LOAD_CATEGORIES_ALL', payload: data});
          },
        onAddOptionSets: (data) => {
            dispatch({ type: 'LOAD_OPTION_SETS_ALL', payload: data});
          },          
          
    })
  )(Dishes);