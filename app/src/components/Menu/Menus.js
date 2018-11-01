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
          dataSource: {},
          flLoading: true, // спиннер загрузки
        };
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
    
    render() {

        const { searchString, currentEditOptionSets, dataSource, flLoading } = this.state;
        const suffix = searchString ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null;
        const columns = [
            { title: 'Имя', dataIndex: 'chName', key: 'name' },
            { title: 'Действие', key: 'operation', fixed: 'right', width: 100, render: (record) => <Dropdown overlay={this.createDropdownMenu({record})} trigger={['click']}>
            <a className="ant-dropdown-link" href="#">
            <Icon type="ellipsis" style={{ transform: "rotate(90deg)" }} />
            </a>
          </Dropdown>},
        ];


        const options = this.props.menus.map(item => <Option key={item.idMenus}>{item.chName}</Option>);

        return (<div>
            <Content style={{ background: '#fff'}}>
                <div style={{ padding: 10 }}>
                    Меню
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
                                <div style={{ margin: 0 }}>
                                    <div>Активность: {record.description}</div>
                                    <div>Отображаемое имя: </div>
                                    Обязательный набор:
                                    Множественный выбор:

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
                    <TabPane tab="Сортировка" key="4">

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
  )(Menus);