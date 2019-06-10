import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon, message, Alert, Button, Spin } from 'antd';
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

class StockSorting extends Component {

    constructor(props) {
        super(props);
        this.state = {
          items: this.props.stock.map((item) => {
            return {id: item.idStock, content: item.chName, iSort: item.iSort} 
          }),
          flLoading: false,
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

    componentWillReceiveProps(nextProps) {
        if(nextProps.param !== this.props.param) {
            this.setState({
              items: nextProps.param.map((item) => {
                return {id: item.idStock, content: item.chName, iSort: item.iSort} 
              }),
            })
        }
        
    }
    


      saveSort = (e) => {
        
        const url = `${this.props.optionapp[0].serverUrl}/EditStockSort.php`; // изменяем категорию
            fetch(url, {
              method: 'POST',
              body: JSON.stringify(
              {
                stock: this.state.items.map( (item, index) => {
                  return {
                    idStock: item.id,
                    iSort: index.toString(),
                  }
                })
              })
            }).then((response) => response.json()).then((responseJsonFromServer) => {
              message.success('Сортировка сохранена');
              this.props.handlerSort();
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
                      </Button> : <Alert message="Акции не найдены" type="warning" showIcon />
                      }
                    </Spin>
        </div>);
    }

}


export default connect (
    state => ({
        stock: state.stock,
        owner: state.owner,
        optionapp: state.optionapp,
    }),
    dispatch => ({

    })
  )(StockSorting);