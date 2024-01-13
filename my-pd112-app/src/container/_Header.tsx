import {Avatar, Button,  Layout, Menu} from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
//import {useUser} from "../auth/login/AuthContext.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AuthReducerActionType, IAuthReducerState} from "../auth/login/AuthReducer.ts";

const { Header } = Layout;

const items1 = ['Home', 'Add'].map((key) => ({
    key,
    label: `${key}`,
    link: key.toLowerCase(), // Add a link property based on the item key
}));


const ButtonStyle = {
    margin: '0 10px 0 0',
};
const DefaultHeader = () => {
    const location = useLocation();
    const navigateTo = useNavigate();
   // const { user, logoutUser  } = useUser();
    //HW
    //Get the state
    const {isAuth, user} = useSelector((redux: any)=>redux.auth as IAuthReducerState);
    const dispatch = useDispatch();
    const BASE_URL: string = import.meta.env.VITE_API_URL as string;
    const avatarUrl = BASE_URL + "/upload/150_" + user?.image;

    console.log(avatarUrl);
    const handleSignInClick = () => {
        navigateTo('/login')
    };

    const handleLogOutClick = () => {
        //HW
        //Get the info about new state in response to action and  send it to reducer for changing a state
        dispatch({
            type: AuthReducerActionType.LOGOUT_USER,
        });
       // logoutUser();
         localStorage.removeItem("token");
         navigateTo('/')
    };

    const handleRegisterClick = () => {
        // Navigate to the login form when the button is clicked
        navigateTo('/register')
    };
    return (
        <Header style={{ display: 'flex', alignItems: 'center' }}>
            <div className="demo-logo" />
            <Menu
                theme="dark"
                mode="horizontal"
                selectedKeys={[location.pathname.substr(1)]} // Highlight the selected menu item
                style={{ flex: 1, minWidth: 0 }}
            >
                {items1.map((item) => (
                    <Menu.Item key={item.link}>
                        <Link to={`/${item.link}`}>{item.label}</Link>
                    </Menu.Item>
                ))}
            </Menu>

            {!isAuth ?
                (
                    <>
                    <Button style={ButtonStyle} onClick={handleSignInClick}>
                        Sign-In
                    </Button>
                <Button onClick={handleRegisterClick}>Register</Button>
                </>
                ) :
                <>
                    <Avatar size="large" src={avatarUrl} alt={user?.email} />
                    <span style={{ marginRight: 10, marginLeft: 10, color: "white" }}>{user?.email}</span>
                    <Button style={ButtonStyle} onClick={handleLogOutClick}>
                        LogOut
                    </Button>
                </>
            }
            {/*}*/}

            {/*{user ? (*/}
            {/*    <>*/}
            {/*        <Avatar size="large" src={avatarUrl} alt={user.email} />*/}
            {/*        <span style={{ marginRight: 10, marginLeft: 10,color: 'white' }}>{user.email}</span>*/}
            {/*        <Button style={ButtonStyle} onClick={handleLogOutClick}>*/}
            {/*            LogOut*/}
            {/*        </Button>*/}
            {/*    </>*/}
            {/*) : (*/}
            {/*    <>*/}
            {/*        <Button style={ButtonStyle} onClick={handleSignInClick}>*/}
            {/*            Sign-In*/}
            {/*        </Button>*/}
            {/*        <Button onClick={handleRegisterClick}>Register</Button>*/}
            {/*    </>*/}
            {/*)}*/}
        </Header>
    );
};

export default DefaultHeader;


