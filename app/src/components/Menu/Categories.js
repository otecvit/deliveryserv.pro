import React, { Component } from 'react';
import { Layout, Tabs, Input, Icon, Table } from 'antd';
const { Content } = Layout;
const TabPane = Tabs.TabPane;


const columns = [
    { title: 'Имя', dataIndex: 'name', key: 'name' },
    { title: 'Действие', key: 'operation', fixed: 'right', width: 100, render: () => <a href="javascript:;"><Icon type="ellipsis" style={{ transform: "rotate(90deg)" }} /></a> },
];

const data = [
    { key: 1, name: 'John Brown', description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.' },
    { key: 2, name: 'Jim Green', description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.' },
    { key: 3, name: 'Joe Black', description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.' },
  ];


class Categories extends Component {

    constructor(props) {
        super(props);
        this.state = {
          searchString: '',
        };
    }

    emitEmpty = () => {
        this.searchStringInput.focus();
        this.setState({ searchString: '' });
    }
    
    onChangeSearchString = (e) => {
        this.setState({ searchString: e.target.value });
    }

    render() {

        const { searchString } = this.state;
        const suffix = searchString ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null;

        return (<div>
        <Content style={{ background: '#fff'}}>
            <div style={{ padding: 10 }}>
                Категории
            </div>
        </Content>
        <Content style={{ background: '#fff', margin: '16px 0' }}>
            <div style={{ padding: 10 }}>
            <Tabs defaultActiveKey="1">
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
                <TabPane tab="Редактировать" key="3">Content of Tab Pane 3</TabPane>
            </Tabs>
            </div>
        </Content>
        </div>);
    }
}

export default Categories;