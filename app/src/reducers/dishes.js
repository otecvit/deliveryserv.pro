const initialState = [
    { key: "1", idDishes: "1", chName: 'Пицца Чикита', chNamePrint: "Чикита", enShow: "true", blMultiple: "true", blNecessarily: "true", options: 
      [
        {key: "1", chName: "150 см", chPriceChange: "0", iSort: "100", blDefault: "false"},
        {key: "2", chName: "250 см", chPriceChange: "5", iSort: "200", blDefault: "true"},
        {key: "3", chName: "350 см", chPriceChange: "10", iSort: "300", blDefault: "false"}
      ], description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.' }
    
];

export default function dishes (state = initialState, action) {
    switch (action.type) {
      case "LOAD_DISHES_SUCCESS":
        return [
          ...state,
          action.payload
        ];  
      case "ADD__DISHES":
        return [
          ...state,
          action.payload.dataload
        ];   
      case "EDIT_DISHES": 
        // проходим по основному state
        const updatedRootItems = state.map(item => {
          if(item.idDishes === action.payload.dataload.idDishes){
            return {...item, ...action.payload.dataload};
          }
          return item;
        });
    
        return updatedRootItems;

        case "DELETE_DISHES": 
          return state.filter(optionset => optionset.idDishes !== action.payload.idDishes );
      default:
        return state;
    }
}