import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Layout, Tabs, Input, Icon, Table, Menu, Dropdown, Form, Select, message, Popconfirm, Modal } from 'antd'

import StockForm from './StockForm';
import StockSorting from './StockSorting';

import HeaderSection from '../../items/HeaderSection'

const { Content } = Layout;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;

const generateKey = (pre) => {
    return `${ new Date().getTime() }`;
  }


class Stock extends Component {
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

    handleMenuClick = (e, record) => {
        switch (e.key) {
            case "0": this.edit(record); break; //Редактировать
            case "1": this.copy(record); break; //Копировать
            case "2": this.DeleteStock(record); break; 
            default: this.setState({activeKey: "1"});    
        }        
      }

      edit = (e) => {
        this.setState({
            activeKey: "3",
            currentEditCat: e.record.idStock,
        });
    }

    copy = (e) => {
        // открываем вкладку копирования
        this.setState({
            activeKey: "2",
            currentRecord: e.record,
        });
    }

    DeleteStock = (e) => {
        const url = this.props.optionapp[0].serverUrl + "/DeleteStock.php"; // удаление
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
                idStock: e.record.idStock,
                tmpFileName: e.record.chMainImage.length ? e.record.chMainImage.replace(/^.*(\\|\/|\:)/, '') : "",
             })
          }).then((response) => response.json()).then((responseJsonFromServer) =>
          {
              var val = {
                idStock: e.record.idStock,
              }
              this.props.onDelete(val);  // вызываем action
          }).catch((error) =>
          {
              console.error(error);
          });
    }


    componentDidMount() {
        this.loadingData();
    }



    emitEmpty = () => {
        this.searchStringInput.focus();
        this.setState({ searchString: '' });
    }

    handler = () => {
        this.setState({
            currentEditCat: "0",
        });
      }

      loadingData = () => {

        const url = this.props.optionapp[0].serverUrl + "/SelectStock.php";
        this.setState({
            flLoading: true,
        })
        fetch(url)
        .then((response) => response.json())
        .then((responseJson) => {
            this.props.onAdd(responseJson.stock);
            this.setState({
                dataSource: responseJson.stock,
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
            dataSource: this.props.categories.map((record) => {
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
        const menu = (
            <Menu onClick={e => this.handleMenuClick(e, record)}>
              <Menu.Item key="0">Редактировать</Menu.Item>
              <Menu.Item key="1">Копировать</Menu.Item>
              <Menu.Item key="2"> Удалить </Menu.Item>
            </Menu>
          );
        
        return menu;
    }

    onChangeCategory = (e) => {
        this.setState ({ 
            currentEditCat: e.key
        });
    }

    render() {

        const { searchString, currentEditCat, dataSource, flLoading } = this.state;
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
        const options = this.props.stock.map(item => <Option key={item.idStock}>{item.chName}</Option>);

        return (<div>
        <HeaderSection title="Акции" icon="icon-orders"/>
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
                                    <div className="d-td title-detail">Отображаемое имя</div>
                                    <div className="d-td content-detail">{record.chNamePrint}</div>
                                </div>
                            </div>
                        }
                        dataSource={!this.state.filtered ? this.props.stock : dataSource}
                        size="small"  
                        pagination={false}
                        loading={flLoading}
                        locale={{emptyText: 'Нет данных'}}

                    />,            
                </TabPane>
                <TabPane tab="Создать" key="2">
                    <StockForm copyrecord={this.state.currentRecord}/>
                </TabPane>
                <TabPane tab="Редактировать" key="3">
                    <Select
                    showSearch
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    onChange={this.onChangeCategory}
                    style={{ width: "100%" }}
                    labelInValue 
                    value={{ key: currentEditCat }}
                    >
                    <Option key="0">Выберите категорию для редактирования</Option>
                    {options}
                </Select>
                { currentEditCat === "0" ? null : <StockForm handler = {this.handler} param={currentEditCat}/> }
                </TabPane>
                <TabPane tab="Сортировка" key="4">
                    <StockSorting />
                </TabPane>
            </Tabs>
            </div>
        </Content>
        </div>);
    }


}
export default connect (
    state => ({
        stock: state.stock,
        optionapp: state.optionapp,
    }),
    dispatch => ({
        onAdd: (data) => {
            dispatch({ type: 'LOAD_STOCK_ALL', payload: data});
          },
        onDelete: (categoryData) => {
            dispatch({ type: 'DELETE_STOCK', payload: categoryData});
        },
    })
  )(Stock);