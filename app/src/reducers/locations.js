const initialState = [
    { key: "1", idLocations: "1", chName: 'Витебск', chNamePrint: "Johni", enShow: "1", description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.' },
    { key: "2", idLocations: "2", chName: 'Полоцк', chNamePrint: "Jimi", enShow: "1", description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.' },
  
];


export default function locations (state = initialState, action) {
    switch (action.type) {
      case "LOAD_LOCATIONS_ALL":
        return action.payload; 
      case "LOAD_LOCATIONS_SUCCESS":
        return [
          ...state,
          action.payload
        ];  
      case "ADD_LOCATIONS":
        return [
          ...state,
          action.payload.dataload
        ];   
      case "EDIT_LOCATIONS": 
        // проходим по основному state
        const updatedRootItems = state.map(item => {
          if(item.idCategories === action.payload.dataload.idCategories){
            return {...item, ...action.payload.dataload};
          }
          return item;
        });
    
        return updatedRootItems;

        case "DELETE_LOCATIONS": 
          return state.filter(category => category.idCategories !== action.payload.idCategories );
      default:
        return state;
    }
}