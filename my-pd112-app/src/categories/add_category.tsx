import React, {useState} from 'react';
import {Button, Divider, Form, Input, Upload} from 'antd';
import {useNavigate} from 'react-router-dom';
import http_common from "../http_common.ts";
import {UploadOutlined} from '@ant-design/icons';
import type {UploadProps} from 'antd';

const props: UploadProps = {
    action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    onChange({file, fileList}) {
        if (file.status !== 'uploading') {
            console.log(file, fileList);
        }
    },
};

const AddCategory: React.FC = () => {
    const navigate = useNavigate();
    const [fileList, setFileList] = useState<any[]>([]);
    const onFinish = async (values: any) => {
        console.log('Success:', values);
        console.log('fileList:', fileList[0].originFileObj as File);

        try {
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('description', values.description);
            formData.append('image', fileList[0].originFileObj as File);

            const response = await http_common.post("/api/addcategory", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Set the correct content type
                },
            });

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
        image?: any;
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
                style={{maxWidth: 1000}}
                initialValues={{remember: true}}
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
                    <Upload {...props} fileList={fileList} onChange={({fileList}) => setFileList(fileList)}>
                        <Button icon={<UploadOutlined/>}>Upload</Button>
                    </Upload>
                </Form.Item>

                <Form.Item<FieldType>
                    label="Description"
                    name="description"
                    rules={[{required: true, message: 'Please input description!'}]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item wrapperCol={{offset: 8, span: 16}}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default AddCategory;

