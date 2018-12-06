const initialState = [];

export default function customers (state = initialState, action) {
    switch (action.type) {
      case "LOAD_CUSTOMERS_ALL":
        return action.payload; 
      case "LOAD_CUSTOMERS_SUCCESS":
        return [
          ...state,
          action.payload
        ];  
      case "ADD_CUSTOMERS":
        return [
          ...state,
          action.payload.dataload
        ];   
      case "EDIT_CUSTOMERS": 
        // проходим по основному state
        const updatedRootItems = state.map(item => {
          if(item.idDishes === action.payload.dataload.idDishes){
            return {...item, ...action.payload.dataload};
          }
          return item;
        });
    
        return updatedRootItems;

        case "DELETE_CUSTOMERS": 
          return state.filter(optionset => optionset.idDishes !== action.payload.idDishes );
      default:
        return state;
    }
}