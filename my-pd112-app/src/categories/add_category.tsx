import React from 'react';
import { Button, Divider, Form, Input } from 'antd';
//import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import http_common from "../http_common.ts";

const AddCategory: React.FC = () => {
    const navigate = useNavigate();

    const onFinish = async (values: any) => {
        console.log('Success:', values);
        try {
          //  const response = await axios.post('http://pd112.tanmos.com/api/addcategory', values);
            const response= await http_common.post("/api/addcategory", values);

            if (response.status === 200) {
                console.log('Data sent successfully!');
                navigate('/'); // Redirect to the homepage
            } else {
                console.error('Failed to send data:', response.statusText);
            }
        } catch (error: any) {
            console.error('Error:', error.message);
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    type FieldType = {
        name?: string;
        image?: string;
        description?: string;
    };

    const customDividerStyle = {
        borderTop: '2px solid #1890ff',
        margin: '5px 0 50px 0',
    };

    return (
        <>
            <Divider style={customDividerStyle}>Add New Category</Divider>
            <Form
                name="basic"
                style={{ maxWidth: 1000 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item<FieldType>
                                label="Category name"
                                name="name"
                                rules={[{required: true, message: 'Please input category name!'}]}
                            >
                                <Input/>
                            </Form.Item>

                            <Form.Item<FieldType>
                                label="Image"
                                name="image"
                                rules={[{required: true, message: 'Please input image!'}]}
                            >
                                <Input/>
                            </Form.Item>

                            <Form.Item<FieldType>
                                label="Description"
                                name="description"
                                rules={[{required: true, message: 'Please input description!'}]}
                            >
                                <Input/>
                            </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default AddCategory;

