const initialState = [
    {
        newOrderCount: 0,
    },       
];

export default function optionapp (state = initialState, action) {
    switch (action.type) {
      case "LOAD_OPTIONAPP_SUCCESS":
        return [
          ...state,
          action.payload
        ];  
      case "ADD_OPTIONAPP":
        return [
          ...state,
          action.payload.dataload
        ];   
        case "EDIT_OPTIONAPP": 
        // проходим по основному state
        const updatedRootItems = state.map(item => {
          if(item.idMenus === action.payload.dataload.idMenus){
            return {...item, ...action.payload.dataload};
          }
          return item;
        });
    
        return updatedRootItems;

        case "EDIT_OPTIONAPP_CONTROL_ORDER": 
        // проходим по основному state
        const updatedCountOrder = state.map(item => {
            return {...item, ...action.payload};
        });
    
        return updatedCountOrder;

        case "DELETE_OPTIONAPP": 
          return state.filter(optionset => optionset.idDishes !== action.payload.idDishes );
      default:
        return state;
    }
}