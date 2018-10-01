import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout, Tabs, Input, Icon, Table, Menu, Dropdown, Form, Select } from 'antd';

import CategoriesForm from './CategoriesForm';

const { Content } = Layout;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;


class Categories extends Component {

    constructor(props) {
        super(props);
        this.state = {
          searchString: '',
          activeKey: "1",
          currentEditCat: "0",
        };
    }

    handleMenuClick = (e, record) => {
        switch (e.key) {
            case "0": this.editCategory(record); break; //Редактировать
            case "1": this.setState({activeKey: "2"}); break; //Копировать
            default: this.setState({activeKey: "1"});    
        }        
      }

    editCategory = (record) => {
        this.setState({activeKey: "3"});


    }

    emitEmpty = () => {
        this.searchStringInput.focus();
        this.setState({ searchString: '' });
    }
    
    onChangeSearchString = (e) => {
        this.setState({ searchString: e.target.value });
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
              <Menu.Item key="2">Удалить</Menu.Item>
            </Menu>
          );
        
        return menu;
    }

    onChangeCategory = (e) => {
        console.log(e.key);
        this.setState ({ currentEditCat: e.key});
    }

    render() {

        const { searchString, currentEditCat } = this.state;
        const suffix = searchString ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null;
        const columns = [
            { title: 'Имя', dataIndex: 'name', key: 'name' },
            { title: 'Действие', key: 'operation', fixed: 'right', width: 100, render: (record) => <Dropdown overlay={this.createDropdownMenu({record})} trigger={['click']}>
            <a className="ant-dropdown-link" href="#">
            <Icon type="ellipsis" style={{ transform: "rotate(90deg)" }} />
            </a>
          </Dropdown>},
        ];

        //const { form } = this.props;
        //const { getFieldDecorator } = form;
        const labelColSpan = 8;
        const wrapperColSpan = 16;
        
        const data = [
            { key: 1, name: 'John Brown', description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.' },
            { key: 2, name: 'Jim Green', description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.' },
            { key: 3, name: 'Joe Black', description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.' },
          ];

        const options = data.map(item => <Option key={item.key}>{item.name}</Option>);

        return (<div>
        <Content style={{ background: '#fff'}}>
            <div style={{ padding: 10 }}>
                Категории
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
                        expandedRowRender={record => <p style={{ margin: 0 }}>{record.description}</p>}
                        dataSource={data}
                        size="small"  
                        pagination={false}

                    />,            
                </TabPane>
                <TabPane tab="Создать" key="2">Content of Tab Pane 2</TabPane>
                <TabPane tab="Редактировать" key="3">
                    <Select
                    showSearch
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    onChange={this.onChangeCategory}
                    style={{ width: "100%" }}
                    labelInValue 
                    defaultValue={{ key: "0" }}
                    >
                    <Option key="0">Выберите категорию для редактирования</Option>
                    {options}
                </Select>
                { currentEditCat === "0" ? null : <CategoriesForm param={currentEditCat}/> }
                </TabPane>
            </Tabs>
            </div>
        </Content>
        </div>);
    }
}

export default connect (
    state => ({

    }),
    dispatch => ({
    })
  )(Categories);

