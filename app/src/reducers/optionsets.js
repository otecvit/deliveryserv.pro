const initialState = [
    { key: "1", idOptionSets: "1", chName: 'Размер для Чикиты', chNamePrint: "Размер", enShow: "true", blMultiple: "true", blNecessarily: "true", options: 
      [
        {key: "1", chName: "150 см", chPriceChange: "0", iSort: "100", blDefault: "false"},
        {key: "2", chName: "250 см", chPriceChange: "5", iSort: "200", blDefault: "true"},
        {key: "3", chName: "350 см", chPriceChange: "10", iSort: "300", blDefault: "false"}
      ], description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.' },
    { key: "2", idOptionSets: "2", chName: 'Набор для Чикиты', chNamePrint: "Набор", enShow: "true", blMultiple: "false", blNecessarily: "false", options: 
      [
        {key: "1", chName: "сыр", chPriceChange: "1", iSort: "100", blDefault: "false"},
        {key: "2", chName: "ветчина", chPriceChange: "1", iSort: "200", blDefault: "false"},
        {key: "3", chName: "ананас", chPriceChange: "1", iSort: "300", blDefault: "false"}
      ], description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.' },
    { key: "3", idOptionSets: "3", chName: 'Объем для колы', chNamePrint: "Объём", enShow: "true", blMultiple: "true", blNecessarily: "false", options: 
      [
        {key: "11", chName: "0.5 л", chPriceChange: "0", iSort: "100", blDefault: "false"},
        {key: "22", chName: "1 л", chPriceChange: "1", iSort: "200", blDefault: "false"},
        {key: "33", chName: "2 л", chPriceChange: "2", iSort: "300", blDefault: "true"}
      ], description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.' },
    { key: "4", idOptionSets: "4", chName: 'Вес для пирога', chNamePrint: "Вес", enShow: "true", blMultiple: "true", blNecessarily: "true", options: 
      [
        {key: "1", chName: "0,5 кг", chPriceChange: "0", iSort: "100", blDefault: "false"},
        {key: "2", chName: "0,8 кг", chPriceChange: "3", iSort: "200", blDefault: "true"},
        {key: "3", chName: "1 кг", chPriceChange: "6", iSort: "300", blDefault: "false"}
      ], description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.' },
  ];


export default function optionSets (state = initialState, action) {
    switch (action.type) {
      case "LOAD_OPTION_SETS_SUCCESS":
        return [
          ...state,
          action.payload
        ];  
      case "ADD_OPTION_SETS":
        return [
          ...state,
          action.payload.dataload
        ];   
      case "EDIT_OPTION_SETS": 
        // проходим по основному state
        const updatedRootItems = state.map(item => {
          if(item.idOptionSets === action.payload.dataload.idOptionSets){
            return {...item, ...action.payload.dataload};
          }
          return item;
        });
    
        return updatedRootItems;

        case "DELETE_OPTION_SETS": 
          return state.filter(category => category.idCategories !== action.payload.idCategories );
      default:
        return state;
    }
}