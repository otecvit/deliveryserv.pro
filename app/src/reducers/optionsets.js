const initialState = [
    { key: "1", idOptionSets: "1", chName: 'Размер для Чикиты', chNamePrint: "Размер", enShow: "1", description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.' },
    { key: "2", idOptionSets: "2", chName: 'Набор для Чикиты', chNamePrint: "Набор", enShow: "1", description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.' },
    { key: "3", idOptionSets: "3", chName: 'Объем для колы', chNamePrint: "Объём", enShow: "0", description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.' },
    { key: "4", idOptionSets: "4", chName: 'Вес для пирога', chNamePrint: "Вес", enShow: "1", description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.' },
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
          if(item.idCategories === action.payload.dataload.idCategories){
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