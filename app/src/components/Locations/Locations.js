import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Layout, Tabs, Input, Icon, Table, Menu, Dropdown, Select, Row, Col } from 'antd';

import LocationsForm from './LocationsForm'
import HeaderSection from '../../items/HeaderSection'
import ViewDetailDescription from '../../items/ViewDetailDescription'


const { Content } = Layout;
const TabPane = Tabs.TabPane;
const Option = Select.Option;

const generateKey = (pre) => {
    return `${ new Date().getTime() }`;
  }

class Locations extends Component {
    constructor(props) {
        super(props);
        this.handler = this.handler.bind(this)

        this.state = {
          searchString: '',
          activeKey: "1",
          currentEditCat: "0",
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
            currentEditCat: e.record.idCategories,
        });
    }

    DeleteCategory = (e) => {
        const url = this.props.optionapp[0].serverUrl + "/DeleteCategories.php"; // удаление
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
                idCategories: e.record.idCategories
             })
          }).then((response) => response.json()).then((responseJsonFromServer) =>
          {
              var val = {
                  idCategories: e.record.idCategories,
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
            currentEditCat: "0",
        });
      }

      loadingData = () => {

        const url = this.props.optionapp[0].serverUrl + "/SelectLocations.php";
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
            this.props.onAdd(responseJson.locations);
            this.setState({
                dataSource: responseJson.locations,
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
            dataSource: this.props.locations.map((record) => {
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
        //console.log(e);
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
          
        const options = this.props.locations.map(item => <Option key={item.idLocations}>{item.chName}</Option>);

        return (<div>
        <HeaderSection title="Адреса" icon="icon-map-marker" />
        <Content style={{ background: '#fff', margin: '16px 0', width: 800 }}>
            <div style={{ padding: 20 }}>
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
                        maxLength="100"
                    />    
                    <Table
                        columns={columns}
                        expandedRowRender={({chAddress, arrPhones, arrOperationMode, blPickup}) => 
                            <Fragment>
                                <ViewDetailDescription title="Адрес" value={chAddress} />
                                <ViewDetailDescription title="Телефон" value={arrPhones.map(phone => <div key={phone.iPhone}>{phone.chPhone}</div>)} />
                                <ViewDetailDescription title="Режим работы" value={
                                    arrOperationMode.map(OperationMode => {
                                        return (
                                            !OperationMode.blDayOff ? 
                                            OperationMode.time.map((item, index) =>
                                                <Row key={index}>
                                                    <Col span={5}>{OperationMode.chDay}: </Col>
                                                    <Col span={19}>{item.tStartTime} - {item.tEndTime}</Col>
                                                </Row>)
                                            : 
                                                <Row key={OperationMode.chDay}>
                                                    <Col span={5}>
                                                        {OperationMode.chDay}:
                                                    </Col>
                                                    <Col span={19}>
                                                        Выходной
                                                    </Col>
                                                </Row>
                                    ) 
                                    })} 
                                />
                                <ViewDetailDescription title="Доставка" value={blPickup ? "Да" : "Нет"} />
                            </Fragment>
                        }
                        dataSource={!this.state.filtered ? this.props.locations : dataSource}
                        size="small"  
                        pagination={false}
                        loading={flLoading}
                        locale={{emptyText: 'Нет данных'}}

                    />,            
                </TabPane>
                <TabPane tab="Создать" key="2">
                    <LocationsForm/>
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
                    <Option key="0">Выберите ресторан для редактирования</Option>
                    {options}
                </Select>
                { currentEditCat === "0" ? null : <LocationsForm handler = {this.handler} param={currentEditCat}/> }
                </TabPane>
            </Tabs>
            </div>
        </Content>
        </div>);
    }
}

export default connect (
    state => ({
        locations: state.locations,
        optionapp: state.optionapp,
        owner: state.owner,
    }),
    dispatch => ({
        onAdd: (data) => {
            dispatch({ type: 'LOAD_LOCATIONS_ALL', payload: data});
          },
        onDelete: (data) => {
            dispatch({ type: 'DELETE_LOCATIONS', payload: data});
        },
    })
  )(Locations);

