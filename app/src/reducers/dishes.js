const initialState = [
    { 
      key: "1", 
      idDishes: "1", 
      chName: 'Пицца Чикита', 
      chNamePrint: "Чикита", 
      chSubtitle: "супер пицца", 
      chPrice: "15.50",
      chOldPrice: "20",
      chDescription: "Пицца которую можно поглощать круглосуточно",
      iCategories: "1",
      enShow: "true", 
      chOptionSets: ["1","3"],
      chDefOptionSet: "Размер для Чикиты",
      chTags: ["2"],
      ingredients: [
        {key: "1", chName: "Сыр", iSort: "100"},
        {key: "2", chName: "Ананас", iSort: "200"},
        {key: "3", chName: "Курица", iSort: "300"},
      ]
    }, { 
      key: "2", 
      idDishes: "2", 
      chName: 'Пицца Маргарита', 
      chNamePrint: "Маргарита", 
      chSubtitle: "супер пицца", 
      chPrice: "35.00",
      chOldPrice: "",
      chDescription: "Крутая весчь",
      iCategories: "1",
      enShow: "true", 
      chOptionSets: ["2","3"],
      chDefOptionSet: "Размер для Чикиты",
      chTags: ["1", "2"],
      ingredients: [
        {key: "1", chName: "Колбаса", iSort: "100"},
        {key: "2", chName: "Сыр х2", iSort: "200"},
      ]
    },
    
];

export default function dishes (state = initialState, action) {
    switch (action.type) {
      case "LOAD_DISHES_SUCCESS":
        return [
          ...state,
          action.payload
        ];  
      case "ADD_DISHES":
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