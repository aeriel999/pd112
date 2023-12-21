import {Button, Divider, Form, Input, Upload, message, Alert} from "antd";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {LoadingOutlined, PlusOutlined} from '@ant-design/icons';
import type {UploadChangeParam} from 'antd/es/upload';
import type {RcFile, UploadFile, UploadProps} from 'antd/es/upload/interface';
import {ICategoryCreate} from "./type.ts";
import {customDividerStyle} from "./styles.ts";
import {addCategory} from "./api.tsx";

const AddCategory = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState<File | null>(null);
    const [errorMSG, setErrorMSG] = useState<string>("");

    const onFinish = async (values: any) => {

        if(file==null) {
            setErrorMSG("Choose photo");
            return;
        }

        const model : ICategoryCreate = {
            name: values.name,
            image: file,
            description: values.description,
        };

        // try {
        //     await http_common.post("/api/categories/add", model,{
        //         headers: {
        //             "Content-Type": "multipart/form-data"
        //         }
        //     });
        //     navigate("/");
        // }
        // catch (ex) {
        //     message.error('Error in creating of category');
        // }

        await addCategory(model);

        navigate("/");
    }

    const onFinishFailed = (errorInfo: any) => {
        message.error('Failed:', errorInfo);
    };

    type FieldType = {
        name?: string;
        description?: string;
    };

    const [loading, setLoading] = useState(false);

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
    return (
        <>
            <Divider style={customDividerStyle}>Add New Category</Divider>
            {errorMSG && <Alert message={errorMSG} type='error'/>}
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
                    {file ? <img src={URL.createObjectURL(file)} alt="avatar" style={{width: '100%'}}/> : uploadButton}
                </Upload>

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
}

export default AddCategory;
