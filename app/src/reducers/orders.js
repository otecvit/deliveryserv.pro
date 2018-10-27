const initialState = [/*
    { 
        key: "1", 
        idOrders: "1", 
        iStatus: "0",
        chNameOrder: "1", 
        chNameClient: "Иван", 
        chDue: "сейчас", 
        chPlaced: "2 часа назад",
        chTotal: "30 BYN",
        chLocation: "Витебск",
      },  { 
        key: "2", 
        idOrders: "2", 
        iStatus: "5",
        chNameOrder: "2", 
        chNameClient: "Максим", 
        chDue: "к 22:00", 
        chPlaced: "2 часа назад",
        chTotal: "20 BYN",
        chLocation: "Витебск",
      }, { 
        key: "3", 
        idOrders: "3", 
        iStatus: "3",
        chNameOrder: "3", 
        chNameClient: "Артур", 
        chDue: "сейчас", 
        chPlaced: "3 часа назад",
        chTotal: "60 BYN",
        chLocation: "Витебск",
      }, 


        */
];

export default function orders (state = initialState, action) {
    switch (action.type) {
      case "LOAD_ORDERS_ALL":
        return action.payload; 
      case "LOAD_ORDERS_SUCCESS":
        return [
          ...state,
          action.payload
        ];  
      case "ADD_ORDERS":
        return [
          ...state,
          action.payload.dataload
        ];   
        case "EDIT_ORDERS": 
        // проходим по основному state
        const updatedRootItems = state.map(item => {
          if(item.idMenus === action.payload.dataload.idMenus){
            return {...item, ...action.payload.dataload};
          }
          return item;
        });
    
        return updatedRootItems;

      case "EDIT_ORDERS_STATUS": 
        // проходим по основному state
        const updatedStatus = state.map(item => {
          if(item.idOrder === action.payload.idOrder){
            return {...item, ...action.payload};
          }
          return item;
        });
    
        return updatedStatus;

        case "DELETE_ORDERS": 
          return state.filter(optionset => optionset.idDishes !== action.payload.idDishes );
      default:
        return state;
    }
}