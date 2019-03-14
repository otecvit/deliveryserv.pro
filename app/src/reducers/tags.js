const initialState = [];


export default function tags (state = initialState, action) {
    switch (action.type) {
      case "LOAD_TAG_ALL":
        return action.payload; 
      case "LOAD_TAG_SUCCESS":
        return [
          ...state,
          action.payload
        ];  
      case "ADD_TAG":
        return [
          ...state,
          action.payload.dataload
        ];   
      case "EDIT_TAG": 
        // проходим по основному state
        const updatedRootItems = state.map(item => {
          if(item.idTag === action.payload.idTag){
            return {...item, ...action.payload};
          }
          return item;
        });
    
        return updatedRootItems;

        case "DELETE_TAG": 
          return state.filter(tag => tag.idTag !== action.payload.idTag );
      default:
        return state;
    }
}