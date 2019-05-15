const initialState = [];

export default function orders (state = initialState, action) {
    switch (action.type) {
      case "LOAD_ORDERS_ALL":
        return action.payload; 
      case "LOAD_ORDERS_SUCCESS":
        return [
          ...state,
          action.payload
        ];  
      case "ADD_ORDERS":
        return [
          ...state,
          action.payload.dataload
        ];   
        case "EDIT_ORDERS": 
        // проходим по основному state
        const updatedRootItems = state.map(item => {
          if(item.idMenus === action.payload.dataload.idMenus){
            return {...item, ...action.payload.dataload};
          }
          return item;
        });
    
        return updatedRootItems;

      case "EDIT_ORDERS_STATUS": 
        // проходим по основному state
        const updatedStatus = state.map(item => {
          if(item.idOrder === action.payload.idOrder){
            return {...item, ...action.payload};
          }
          return item;
        });
    
        return updatedStatus;

        case "DELETE_ORDERS": 
          return state.filter(optionset => optionset.idDishes !== action.payload.idDishes );
      default:
        return state;
    }
}