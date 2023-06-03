import { createReducer } from "@reduxjs/toolkit";

const initialState={
    c:0,
    country:null,
    role:null,
};
export const customReducer =createReducer(initialState,{

increament:(state)=>{
    state.c += 1;
},
decrement:(state)=>{
    state.c -=1;
} ,      
setcountry:(state,action)=>{
    state.country= action.payload;
},
setrole:(state,action)=>{
    
    state.role = action.payload;
}  
})