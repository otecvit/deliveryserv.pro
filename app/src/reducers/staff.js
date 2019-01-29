const initialState = [/*
    { key: "1", idCategories: "1", chName: 'Пицца', chNamePrint: "Johni", enShow: "1", description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.' },
    { key: "2", idCategories: "2", chName: 'Суши', chNamePrint: "Jimi", enShow: "1", description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.' },
    { key: "3", idCategories: "3", chName: 'Торты', chNamePrint: "Joek", enShow: "0", description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.' },
    { key: "4", idCategories: "4", chName: 'Пироги', chNamePrint: "Joek", enShow: "1", description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.' },
*/];


export default function staff (state = initialState, action) {
    switch (action.type) {
      case "LOAD_STAFF_ALL":
        return action.payload; 
      case "LOAD_STAFF_SUCCESS":
        return [
          ...state,
          action.payload
        ];  
      case "ADD_STAFF":
        return [
          ...state,
          action.payload.dataload
        ];   
      case "EDIT_STAFF": 
        // проходим по основному state
        const updatedRootItems = state.map(item => {
          if(item.idCategories === action.payload.dataload.idCategories){
            return {...item, ...action.payload.dataload};
          }
          return item;
        });
    
        return updatedRootItems;

        case "DELETE_STAFF": 
          return state.filter(category => category.idCategories !== action.payload.idCategories );
      default:
        return state;
    }
}