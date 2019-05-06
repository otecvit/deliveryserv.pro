import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout, Tabs, Input, Icon, Table, Menu, Dropdown, Form, Select, message, Alert, Button, Spin } from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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

class TovarSorting extends Component {

    constructor(props) {
        super(props);
        this.state = {
          items: [],
          flLoading: true,
          currentEditCat: "0",
          dataSource: [],
        };
        this.onDragEnd = this.onDragEnd.bind(this);
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

      componentDidMount() {
        this.loadingData(this.props.param);
      }
    
      loadingData = (idCategories) => {
        const url = this.props.optionapp[0].serverUrl + "/SelectProductSort.php"; // изменяем категорию
            fetch(url, {
              method: 'POST',
              body: JSON.stringify(
              {
                idCategories: idCategories,
              })
            })
            .then((response) => response.json())
            .then((responseJson) => {
              this.setState({
                items: responseJson.products.map((item) => {
                  return {id: item.idDishes, content: item.chName, iSort: item.iSort} 
                }),
                flLoading: false,
            });
            }).catch((error) => {
                console.error(error);
            }); 

    }

      saveSort = (e) => {
        
        const url = this.props.optionapp[0].serverUrl + "/EditProductSort.php"; // изменяем категорию
            fetch(url, {
              method: 'POST',
              body: JSON.stringify(
              {
                products: this.state.items.map( (item, index) => {
                  return {
                    idProduct: item.id,
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
            //console.log(e);
            this.setState ({ 
                currentEditCat: e.key
            });
        }

        componentWillReceiveProps(nextProps) {
          
          if(nextProps.param !== this.props.param) {
            this.loadingData(nextProps.param);
          }
        }
      

    render() {
        const { items, flLoading } = this.state;
        const IconFont = Icon.createFromIconfontCN({
            scriptUrl: this.props.optionapp[0].scriptIconUrl,
        });

        return (<div style={{ marginTop: "10px" }}>
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
                      { items.length ?
                      <Button type="primary" onClick={this.saveSort} style={{marginBottom: "10px"}}>
                        <Icon type="plus"/>Сохранить
                      </Button> : <Alert message="В категории нет товаров" type="warning" showIcon />
                      }
                    </Spin>
        </div>);
    }

}


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
  )(TovarSorting);