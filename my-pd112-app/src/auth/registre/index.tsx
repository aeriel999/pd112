import {Button, Divider, Form, Input, Upload, Alert, Modal} from "antd";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import { PlusOutlined} from '@ant-design/icons';
import {IRegister} from "../type.ts";
import {FieldType} from "../../categories/type.ts";
import http_common from "../../http_common.ts";
import {customDividerStyle} from "../../categories/styles.ts";
import {imageConverter} from "../../interfaces/forms";
import {RcFile, UploadFile, UploadProps} from "antd/es/upload/interface";

const Register = () => {
    const navigate = useNavigate();
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [file, setFile] = useState<UploadFile | null>();
    const [errorMSG, setErrorMSG] = useState<string>("");

    async function createUser(model: IRegister) {

        try {
            const response = await http_common.post("/api/register", model, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            return response.status;
        } catch (error: any) {
            return error.response.data.message;
        }
    }

    const onFinish = async (values: any) => {

        if (file == null) {
            setErrorMSG("Choose photo");
            return;
        }

        const model: IRegister = {
            ...values,
            image: values.image?.thumbUrl
        };

        const response = await createUser(model);

        if (response == 200) {
            navigate("/");
        } else {
            setErrorMSG(response);
        }

    }

    const onFinishFailed = (errorInfo: any) => {
        setErrorMSG(errorInfo.message)
    };

    const handleCancel = () => setPreviewOpen(false);
    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = URL.createObjectURL(file.originFileObj as RcFile);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    };

    const handleChange: UploadProps['onChange'] = ({fileList: newFile}) => {
        const newFileList = newFile.slice(-1);
        setFile(newFileList[0]);
    };


    return (
        <>
            <Divider style={customDividerStyle}>Registration</Divider>
            {errorMSG && <Alert message={errorMSG} type='error'/>}
            <Form
                name="basic"
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}
                style={{
                    maxWidth: 800,
                }}
                initialValues={{remember: true}}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item<FieldType>
                    label="Ім'я"
                    name="name"
                    rules={[
                        {required: true, message: 'It is required field'},
                        {min: 2, message: 'Name must be at least 2 symbols!'}
                    ]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="lastName"
                    name="lastName"
                    htmlFor="lastName"
                    rules={[
                        {required: true, message: 'It is required field'},
                        {min: 2, message: 'Lastname must be at least 2 symbols!'}
                    ]}
                >
                    <Input autoComplete="lastName"/>
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    htmlFor="email"
                    rules={[
                        {
                            type: 'email',
                            message: 'Mail formats are not correct!',
                        },
                        {required: true, message: 'It is required field'},
                        {min: 2, message: 'Email must be at least 2 symbols!'}
                    ]}
                >
                    <Input autoComplete="email" />
                </Form.Item>


                <Form.Item
                    label="Image"
                    name={"image"}
                    getValueFromEvent={imageConverter}
                >
                    <Upload
                        beforeUpload={() => false}
                        maxCount={1}
                        listType="picture-card"
                        onChange={handleChange}
                        onPreview={handlePreview}
                        accept="image/*"
                    >
                        {file ? null :
                            (
                                <div>
                                    <PlusOutlined/>
                                    <div style={{marginTop: 8}}>Upload</div>
                                </div>)
                        }
                    </Upload>
                </Form.Item>
                <Form.Item
                    label="Phone"
                    name="phone"
                    rules={[
                        {required: true, message: 'It is required field'},
                        {min: 2, message: 'Phone must be at least 11 symbols!'}
                    ]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                        { required: true, message: 'Enter your password!', },
                        { min: 6, message: 'Password must be at least 6 symbols!', },
                    ]}
                    hasFeedback
                >
                    <Input.Password/>
                </Form.Item>

                <Form.Item
                    name="confirm"
                    label="Confirm password"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Pleas confirm password!',
                        },
                        ({getFieldValue}) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Passwords are not matched!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password/>
                </Form.Item>

                <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                    <img alt="example" style={{width: '100%'}} src={previewImage}/>
                </Modal>
                <Form.Item wrapperCol={{offset: 8, span: 16}}>
                    <Button type="primary" htmlType="submit">
                        Register
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}

export default Register;
