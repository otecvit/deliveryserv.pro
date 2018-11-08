import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// fake data generator
const getItems = count =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k}`,
    content: `item ${k}`    
  }));

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
  background: isDragging ? 'lightgreen' : 'grey',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
  width: 250,
});

class Sorting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: this.props.categories.map((item) => {
        return {id: item.idCategories, content: item.chName} 
       }),
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

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    return (
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
                      {item.content}
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
