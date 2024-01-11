import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import '/node_modules/antd/dist/reset.css';
import { BrowserRouter as Router } from "react-router-dom";
import {UserProvider} from "./auth/login/AuthContext.tsx";

// import  {store} from "./store"
// import {jwtDecode} from "jwt-decode";
// import {IUser} from "./auth/type.ts";
// import {AuthReducerActionType} from "./auth/login/AuthReducer.ts";
// import {UserProvider} from "./auth/login/AuthContext.tsx";


// if(localStorage.token) {
//     var user = jwtDecode(localStorage.token) as IUser;
//     store.dispatch({
//         type: AuthReducerActionType.LOGIN_USER,
//         payload: {
//             name: user.name,
//             email: user.email,
//             image: user.image,
//             lastName: user.lastName
//         } as IUser
//     });
// }

ReactDOM.createRoot(document.getElementById('root')!).render(
  //   <Provider store={store}>
  // <Router>
  //     <App />
  // </Router>
  //   </Provider>
    <Router>
        <UserProvider>
            <App />
        </UserProvider>
    </Router>
)


