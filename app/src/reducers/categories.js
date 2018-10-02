const initialState = [
    { key: 1, idCategories: "1", chName: 'Пицца', chNamePrint: "Johni", description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.' },
    { key: 2, idCategories: "2", chName: 'Суши', chNamePrint: "Jimi", description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.' },
    { key: 3, idCategories: "3", chName: 'Торты', chNamePrint: "Joek", description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.' },
    { key: 4, idCategories: "4", chName: 'Пироги', chNamePrint: "Joek", description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.' },
];


export default function categories (state = initialState, action) {
    switch (action.type) {
      case "LOAD_CATEGORIES_SUCCESS":
        return [
          ...state,
          action.payload
        ];  
      case "ADD_CATEGORY":
        return [
          ...state,
          action.payload.dataload
        ];   
      case "EDIT_CATEGORY": 
        // проходим по основному state
        const updatedRootItems = state.map(item => {
          if(item.idCategories === action.payload.dataload.idCategories){
            return {...item, ...action.payload.dataload};
          }
          return item;
        });
    
        return updatedRootItems;

        case "DELETE_CATEGORY": 
          return state.filter(category => category.idCategories !== action.payload.idCategories );
      default:
        return state;
    }
}