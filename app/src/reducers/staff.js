const initialState = [];

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
          action.payload
        ];   
      case "EDIT_STAFF": 
        // проходим по основному state
        const updatedRootItems = state.map(item => {
          if(item.idStaff === action.payload.idStaff){
            return {...item, ...action.payload};
          }
          return item;
        });
    
        return updatedRootItems;

        case "DELETE_STAFF": 
          return state.filter(item => item.idStaff !== action.payload.idStaff );
      default:
        return state;
    }
}