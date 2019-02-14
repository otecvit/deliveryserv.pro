const initialState = [];


export default function pushNotification (state = initialState, action) {
    switch (action.type) {
      case "LOAD_PUSH_ALL":
        return action.payload; 
      case "LOAD_PUSH_SUCCESS":
        return [
          ...state,
          action.payload
        ];  
      case "ADD_PUSH":
        return [
          ...state,
          action.payload
        ];   
      case "EDIT_PUSH": 
        // проходим по основному state
        const updatedRootItems = state.map(item => {
          if(item.idPush === action.payload.idPush){
            return {...item, ...action.payload};
          }
          return item;
        });
    
        return updatedRootItems;

        case "DELETE_PUSH": 
          return state.filter(item => item.idPush !== action.payload.idPush );
      default:
        return state;
    }
}