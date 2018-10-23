const initialState = [
    { 
        key: "1", 
        idMenus: "1", 
        enShow: "true",
        chName: 'Утреннее меню', 
        chNamePrint: "Завтрак", 
        chDescription: "Утреннее меню",
        arrCategories: ["1","3"],
        blDays: "false",
        arrDays: ["1","2","3"],
        blTimes: "true",
        chStartInterval: "0:00:00",
        chEndInterval: "23:59:59",
      }, { 
        key: "2", 
        idMenus: "2", 
        enShow: "true",
        chName: 'Обеденное меню', 
        chNamePrint: "Обед", 
        chDescription: "Обеденное меню",
        arrCategories: ["1","3","4"],
        blDays: "true",
        arrDays: [],
        blTimes: "false",
        chStartInterval: "12:00:00",
        chEndInterval: "14:59:59",
      }, { 
        key: "3", 
        idMenus: "3", 
        enShow: "true",
        chName: 'Вечернее меню', 
        chNamePrint: "Ужин", 
        chDescription: "Вкчернее меню",
        arrCategories: ["1","4"],
        blDays: "true",
        arrDays: [],
        blTimes: "false",
        chStartInterval: "15:00:00",
        chEndInterval: "23:59:59",
      },
        
];

export default function menus (state = initialState, action) {
    switch (action.type) {
      case "LOAD_MENUS_SUCCESS":
        return [
          ...state,
          action.payload
        ];  
      case "ADD_MENUS":
        return [
          ...state,
          action.payload.dataload
        ];   
      case "EDIT_MENUS": 
        // проходим по основному state
        const updatedRootItems = state.map(item => {
          if(item.idMenus === action.payload.dataload.idMenus){
            return {...item, ...action.payload.dataload};
          }
          return item;
        });
    
        return updatedRootItems;

        case "DELETE_MENUS": 
          return state.filter(optionset => optionset.idDishes !== action.payload.idDishes );
      default:
        return state;
    }
}