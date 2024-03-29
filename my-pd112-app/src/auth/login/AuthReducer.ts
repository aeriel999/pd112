import {IUser} from "../type.ts";

export enum AuthReducerActionType{
    LOGIN_USER =  "AUTH_LOGIN_USER",
    LOGOUT_USER = "AUTH_LOGOUT_USER"
}
export interface IAuthReducerState {
    isAuth: boolean,
    user: IUser|null
}

const initState: IAuthReducerState = {
    isAuth: false,
    user: null
}

//HW
//Change the state accordingly to action (Action tell reducer what to do and reducer updates the state)
const AuthReducer = (state = initState, action: any) : IAuthReducerState => {
    switch (action.type) {
        case AuthReducerActionType.LOGIN_USER: {
            const user = action.payload as IUser;

            return {
            isAuth: true,
                user
            } as IAuthReducerState
        }
        case AuthReducerActionType.LOGOUT_USER: {
            return {
                isAuth: false,
                user: null
            } as IAuthReducerState
        }
        default:
            return state;
    }

}
export default AuthReducer;