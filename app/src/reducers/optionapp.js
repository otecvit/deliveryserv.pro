const initialState = [
    {
        newOrderCount: 0,
        allOrderCount: 0,
        isLoggedIn: 0,
        statusCloud: 0,
        serverUrl: "https://deliveryserv.pro/app/api/admin",
        serverUrlStart: "https://deliveryserv.pro/app",
        scriptIconUrl: "//at.alicdn.com/t/font_888167_srr1yn9r6zc.js", //поправить в файле TariffPlans.js
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
          const updatedCountOrder = state.map(item => {
              return {...item, ...action.payload};
          });
          return updatedCountOrder;

        case "CHANGE_OPTIONAPP_CLOUD_STATUS": 
          const updatedCloudStatus = state.map(item => {
              return {...item, ...action.payload};
          });
          return updatedCloudStatus;
        

        case "DELETE_OPTIONAPP": 
          return state.filter(optionset => optionset.idDishes !== action.payload.idDishes );
      default:
        return state;
    }
}