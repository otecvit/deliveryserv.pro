const initialState = {/*chUID: "a3b461d5e2c48b09e7a1"*/};

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