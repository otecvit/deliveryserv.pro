const initialState = [];


export default function locations (state = initialState, action) {
    switch (action.type) {
      case "LOAD_LOCATIONS_ALL":
        return action.payload; 
      case "LOAD_LOCATIONS_SUCCESS":
        return [
          ...state,
          action.payload
        ];  
      case "ADD_LOCATIONS":
        return [
          ...state,
          action.payload
        ];   
      case "EDIT_LOCATIONS": 
        // проходим по основному state
        const updatedRootItems = state.map(item => {
          if(item.idCategories === action.payload.dataload.idCategories){
            return {...item, ...action.payload.dataload};
          }
          return item;
        });
    
        return updatedRootItems;

        case "DELETE_LOCATIONS": 
          return state.filter(category => category.idCategories !== action.payload.idCategories );
      default:
        return state;
    }
}