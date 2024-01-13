import {combineReducers} from "redux";
import {configureStore} from "@reduxjs/toolkit";
import {thunk} from "redux-thunk";
import AuthReducer from "../auth/login/AuthReducer.ts";

export const rootReducer = combineReducers({
    auth: AuthReducer
});

//HW
//store is the place we save the state
export  const  store = configureStore({
    reducer: rootReducer,
    devTools: true,
    middleware: [thunk]
});
