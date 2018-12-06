const initialState = [];

export default function owner (state = initialState, action) {
    switch (action.type) {
      case "LOAD_OWNER_ALL":
        return action.payload; 
      case "LOAD_OWNER_SUCCESS":
        return [
          ...state,
          action.payload
        ];  
      case "ADD_OWNER":
        return [
          ...state,
          action.payload.dataload
        ];   
      case "EDIT_OWNER": 
        // проходим по основному state
            return {...state, ...action.payload};

        case "DELETE_OWNER": 
          return state.filter(optionset => optionset.idDishes !== action.payload.idDishes );
      default:
        return state;
    }
}