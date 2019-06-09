import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout, Tabs, Input, Icon, Table, Menu, Dropdown, Form, Select, message, Popconfirm, Button, Spin } from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import TovarSorting from './TovarSorting'
import MenusSorting from '../Menu/MenusSorting'
import HeaderSection from '../../items/HeaderSection'

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
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(
      {
        chUID: this.props.owner.chUID,
      })
    })
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
          message.success('Сортировка сохранена');
        }).catch((error) => {
            console.error(error);
        });  
        
      }
      
      onChangeCategory = (e) => {
        this.setState ({ 
            currentEditCat: e.key
        });
    }
  
  render() {

    const { flLoading, currentEditCat } = this.state;
    const IconFont = Icon.createFromIconfontCN({
      scriptUrl: this.props.optionapp[0].scriptIconUrl,
    });
    const options = this.props.categories.map(item => <Option key={item.idCategories}>{item.chName}</Option>);

    return (
    <div>
      <HeaderSection title="Сортировка" icon="icon-sort" />
      <Content style={{ background: '#fff', margin: '16px 0' }}>
                <div style={{ padding: 10 }}>
                <Tabs>
                    <TabPane tab="Варианты" key="4">
                      { <MenusSorting /> }
                    </TabPane>
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
                      <Button type="primary" onClick={this.saveSortCategories} style={{marginBottom: "10px"}}>
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

export default connect (
  state => ({
      categories: state.categories,
      dishes: state.dishes,
      optionapp: state.optionapp,
      owner: state.owner,
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
