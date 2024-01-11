import { Form, Input, Button } from "antd";
import {ILogin, IUser} from "../type.ts";
import http_common from "../../http_common.ts";
import { jwtDecode } from "jwt-decode";
import {useUser} from "./AuthContext.tsx";
//import {useDispatch} from "react-redux";
//import {AuthReducerActionType} from "./AuthReducer.ts";

const Login = () => {
 //    const dispatch = useDispatch();
 //    async function loginUser(model: ILogin) {
 //
 //        try {
 //            const response = await http_common.post("/api/login", model, {
 //                headers: {
 //                    "Content-Type": "multipart/form-data"
 //                }
 //            });
 //            return response;
 //        } catch (error: any) {
 //            return error.response.data.message;
 //        }
 //    }
 //    const onFinish = async (values : any) => {
 //        const model : ILogin = {
 //            email: values.email,
 //            password: values.password,
 //        }
 //
 //        const responce = await loginUser(model);
 //
 //        if(responce.status === 200){
 //            const token =  responce.data.token;
 //
 //            localStorage.token = token;
 //
 //            const user = jwtDecode(token) as IUser;
 //
 //            // dispatch({
 //            //    type: AuthReducerActionType.LOGIN_USER,
 //            //     payload:{
 //            //        name: user.name,
 //            //         email: user.email,
 //            //         image: user.image,
 //            //         lastName: user.lastName
 //            //     } as IUser
 //            // });
 //
 //        }
 //        else{
 //            console.log("error", responce)
 //        }

    const { loginUser } = useUser();

    const onFinish = async (values: any) => {
        const model: ILogin = {
            email: values.email,
            password: values.password,
        };

        try {
            const response = await http_common.post('/api/login', model, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                const token = response.data.token;
                localStorage.token = token;

                const user = jwtDecode(token) as IUser;

                loginUser(user); // Update the user state in the context
            } else {
                console.log('error', response);
            }
        } catch (error) {
            console.error('An error occurred during login:', error);
        }
    };


    return (
        <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
        >
            <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: "Please input your email!" }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Please input your password!" }]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                    Login
                </Button>
            </Form.Item>
        </Form>
    );
};

export default Login;
