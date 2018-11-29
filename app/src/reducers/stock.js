const initialState = [];


export default function stock (state = initialState, action) {
    switch (action.type) {
      case "LOAD_STOCK_ALL":
        return action.payload; 
      case "LOAD_STOCK_SUCCESS":
        return [
          ...state,
          action.payload
        ];  
      case "ADD_STOCK":
        return [
          ...state,
          action.payload.dataload
        ];   
      case "EDIT_STOCK": 
        // проходим по основному state
        const updatedRootItems = state.map(item => {
          if(item.idCategories === action.payload.dataload.idCategories){
            return {...item, ...action.payload.dataload};
          }
          return item;
        });
    
        return updatedRootItems;

        case "DELETE_STOCK": 
          return state.filter(category => category.idCategories !== action.payload.idCategories );
      default:
        return state;
    }
}