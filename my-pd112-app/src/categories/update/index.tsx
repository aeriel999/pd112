import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {fetchCategoryDetails, updateCategory} from '../api';
import {customDividerStyle} from "../styles.ts";
import {Alert, Button, Divider, Form, Input, message, Upload} from "antd";
import {FieldType, ICategoryEdit} from "../type.ts";
import type {RcFile, UploadFile, UploadProps} from "antd/es/upload/interface";
import type {UploadChangeParam} from "antd/es/upload";
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons";

const EditCategory: React.FC = () => {
    const {categoryId} = useParams(); // Get the categoryId from the URL params
    const [categoryDetails, setCategoryDetails] = useState<any>(null);
    const [formData, setFormData] = useState<any>({});
    const [file, setFile] = useState<File | null>(null);
    const [errorMSG, setErrorMSG] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const BASE_URL: string = import.meta.env.VITE_API_URL as string;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategory = async () => {
            const details = await fetchCategoryDetails(Number(categoryId));
            setCategoryDetails(details);
            if (!categoryDetails) {
                return <p>Loading...</p>;
            }
        };
        fetchCategory();
    }, [categoryId]);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prevData: any) => ({...prevData, [e.target.name]: e.target.value}));
    };

    const handleFormSubmit = async ( ) => {
        const model : ICategoryEdit = {
            name: formData.name,
            image: file,
            description: formData.description,
            isImageReload: formData.isImageReload
        };
        const result = await updateCategory(Number(categoryId), model);
        if(result == 200)
            navigate("/");
    };

    const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            const file = info.file.originFileObj as File;
            setLoading(false);
            setFile(file);
            setErrorMSG("");
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        message.error('Failed:', errorInfo);
    };

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined/> : <PlusOutlined/>}
            <div style={{marginTop: 8}}>Upload</div>
        </div>
    );

    const beforeUpload = (file: RcFile) => {
        const isImage = /^image\/\w+/.test(file.type);
        if (!isImage) {
            message.error('Choose image!');
        }
        const isLt2M = file.size / 1024 / 1024 < 10;
        if (!isLt2M) {
            message.error('The file size should not exceed 2MB!');
        }
        return isImage && isLt2M;
    };

    const defaultImage = BASE_URL + "/upload/150_" + categoryDetails.image;

    return (
        <>
            <Divider style={customDividerStyle}>Edit Category {categoryDetails.name}</Divider>
            {errorMSG && <Alert message={errorMSG} type='error'/>}
            <Form
                name="basic"
                style={{maxWidth: 1000}}
                initialValues={{remember: true}}
                onFinish={handleFormSubmit}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item<FieldType>
                    label="Category name"
                    // name="name"
                     rules={[{required: true, message: 'Please input category name!'}]}
                >
                    <Input
                        type="text"
                        name="name"
                        value={ formData.name || categoryDetails.name}
                        onChange={handleFormChange}
                    />
                </Form.Item>
                <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                    accept={"image/*"}
                >
                    {file ? (
                        <img src={URL.createObjectURL(file)} alt="avatar" style={{ width: '100%' }} />
                    ) : (
                        <>
                            {defaultImage ? (
                                <img src={defaultImage} alt="default-avatar" style={{ width: '100%' }} />
                            ) : (
                                uploadButton
                            )}
                        </>
                    )}
                </Upload>
                <Form.Item<FieldType>
                    label="Description"
                   // name="description"
                    rules={[{required: true, message: 'Please input description!'}]}
                >
                    <Input
                        type="text"
                        name="description"
                        value={ formData.description || categoryDetails.description}
                        onChange={handleFormChange}
                    />
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

export default EditCategory;
