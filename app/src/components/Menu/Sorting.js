import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout, Tabs, Input, Icon, Table, Menu, Dropdown, Form, Select, message, Popconfirm, Button, Spin } from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import TovarSorting from './TovarSorting';

const { Content } = Layout;
const TabPane = Tabs.TabPane;
const Option = Select.Option;

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  
  // change background colour if dragging
  background: isDragging ? '#f1f1f1' : 'white',
  border: '1px solid #f1f1f1',
  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'white' : 'white',
  padding: '0',
  width: '100%',

});

class Sorting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      flLoading: true,
      currentEditCat: "0",
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  componentDidMount() {
    this.loadingData();
  }

  onDragEnd(result) {
    // dropped outside the list
       
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );

    this.setState({
      items,
    });
  }

  loadingData = () => {

    const url = this.props.optionapp[0].serverUrl + "/SelectCategories.php";
    this.setState({
        flLoading: true,
    })
    fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {
        this.props.onAdd(responseJson.categories);
        this.setState({
            items: responseJson.categories.map((item) => {
              return {id: item.idCategories, content: item.chName, iSort: item.iSort} 
             }),
            flLoading: false,
        });
    })
    .catch((error) => {
      console.error(error);
    });

}
  saveSortCategories = (e) => {
    
    const url = this.props.optionapp[0].serverUrl + "/EditCategoriesSort.php"; // изменяем категорию
        fetch(url, {
          method: 'POST',
          headers: 
          {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(
          {
            categories: this.state.items.map( (item, index) => {
              return {
                idCategories: item.id,
                iSort: index.toString(),
              }
            })
          })
        }).then((response) => response.json()).then((responseJsonFromServer) => {
          //console.log(responseJsonFromServer);
          
          /*
          val = {
            dataload: { 
              key: this.props.param,
              idCategories: this.props.param,
              chName: values.chName,
              chNamePrint: values.chNamePrint,
              enShow: values.enShow ? "true" : "false",
            }
          }
          this.props.onEdit(val);  // вызываем action
          message.success('Категория изменена');
          this.props.form.resetFields(); // ресет полей
          */
        }).catch((error) => {
            console.error(error);
        });  
        
      }
      
      onChangeCategory = (e) => {
        //console.log(e);
        this.setState ({ 
            currentEditCat: e.key
        });
    }
  

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {

    const { flLoading, currentEditCat } = this.state;
    const IconFont = Icon.createFromIconfontCN({
      scriptUrl: this.props.optionapp[0].scriptIconUrl,
    });
    const options = this.props.categories.map(item => <Option key={item.idCategories}>{item.chName}</Option>);

    return (
    <div>
      <Content style={{ background: '#fff'}}>
                <div style={{ padding: 10 }}>
                <div className="title-section"><IconFont type="icon-sort" style={{ fontSize: '16px', marginRight: "10px"}}/>Сортировка</div>
                </div>
      </Content>
      <Content style={{ background: '#fff', margin: '16px 0' }}>
                <div style={{ padding: 10 }}>
                <Tabs>
                    <TabPane tab="Категории" key="1">
                    <Spin spinning={flLoading}>
                      <DragDropContext onDragEnd={this.onDragEnd}>
                        <Droppable droppableId="droppable">
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              style={getListStyle(snapshot.isDraggingOver)}
                            >
                              {this.state.items.map((item, index) => (
                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                  {(provided, snapshot) => (
                                    <div  
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={getItemStyle(
                                        snapshot.isDragging,
                                        provided.draggableProps.style
                                      )}
                                    >
                                      <IconFont type="icon-up_down" style={{ fontSize: '14px', marginRight: "10px"}}/>{item.content}
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>
                      <Button type="primary" onClick={this.saveSortCategories} style={{marginBottom: "10px", marginLeft: '10px'}}>
                        <Icon type="plus"/>Сохранить
                      </Button>
                    </Spin>
                    </TabPane>
                    <TabPane tab="Товары" key="2">
                      <Select
                      showSearch
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      onChange={this.onChangeCategory}
                      style={{ width: "100%" }}
                      labelInValue 
                      value={{ key: currentEditCat }}
                      >
                      <Option key="0">Выберите категорию</Option>
                      {options}
                      </Select>
                      { currentEditCat === "0" ? null : <TovarSorting handler = {this.handler} param={currentEditCat}/> }
                    </TabPane>
                </Tabs>
                </div>
            </Content>
        </div>
    );
  }
}


/*
import React, { Component } from "react";
import { connect } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ServiceCommandUnit from "./ServiceCommandUnit";

// fake data generator

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: 700
});

class Sorting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [
        {id: "1", content: 'Пицца Чикита', children: [
          {id: "2", content: 'Пицца Чикита'},
          {id: "3", content: 'Пицца Чикита'},
          {id: "4", content: 'Пицца Чикита'},
          {id: "5", content: 'Пицца Чикита'},
          {id: "6", content: 'Пицца Чикита'},
          {id: "7", content: 'Пицца Чикита'}
        ]},
        {id: "8", content: 'Пицца Чикита', children: [
          {id: "9", content: 'Пицца Чикита'},
          {id: "10", content: 'Пицца Чикита'},
          {id: "11", content: 'Пицца Чикита'},
          {id: "12", content: 'Пицца Чикита'},
          {id: "13", content: 'Пицца Чикита'},
          {id: "14", content: 'Пицца Чикита'}
        ]},
        {id: "15", content: 'Пицца Чикита', children: [
          {id: "16", content: 'Пицца Чикита'},
          {id: "17", content: 'Пицца Чикита'},
          {id: "18", content: 'Пицца Чикита'},
          {id: "19", content: 'Пицца Чикита'},
          {id: "20", content: 'Пицца Чикита'},
          {id: "21", content: 'Пицца Чикита'}
        ]},
        {id: "22", content: 'Пицца Чикита', children: [
          {id: "23", content: 'Пицца Чикита'},
          {id: "24", content: 'Пицца Чикита'},
          {id: "25", content: 'Пицца Чикита'},
          {id: "26", content: 'Пицца Чикита'},
          {id: "27", content: 'Пицца Чикита'},
          {id: "28", content: 'Пицца Чикита'}
        ]},
      ],
      

      
      
      items: this.props.categories.map((item) => {
        return {id: item.idCategories, content: item.content, children: [{id: '1', content: '1'}, {id: '2', content: '2'}, {id: '3', content: '3'}]} 
       }),
       
      items2: this.props.dishes.map((item) => {
        return {id: item.idDishes, content: item.content} 
       })
       
      };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result) {
    // dropped outside the list
    console.log("innner drag");
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );

    this.setState({
      items
    });
  }

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    //
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable" type="app">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {this.state.items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div>
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        {item.content}
                        <span
                          {...provided.dragHandleProps}
                          style={{
                            display: "inline-block",
                            margin: "0 10px",
                            border: "1px solid #000"
                          }}
                        >
                          Drag
                        </span>
                        <ServiceCommandUnit type={item.id} />

                      </div>
                      {provided.placeholder}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

*/


export default connect (
  state => ({
      categories: state.categories,
      dishes: state.dishes,
      optionapp: state.optionapp,
  }),
  dispatch => ({
      onAdd: (data) => {
          dispatch({ type: 'LOAD_CATEGORIES_ALL', payload: data});
        },
      onDelete: (categoryData) => {
          dispatch({ type: 'DELETE_CATEGORY', payload: categoryData});
      },
  })
)(Sorting);
