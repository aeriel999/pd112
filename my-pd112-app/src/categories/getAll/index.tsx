import React, {useEffect, useState} from 'react';
import {Table, Divider, Button, Popconfirm} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import '/node_modules/antd/dist/reset.css';
import {ICategoryItem} from "./type.ts";
import {useNavigate} from "react-router-dom";
import {EditOutlined, DeleteOutlined} from '@ant-design/icons';
import {deleteCategory, fetchData} from "./api";

const GetCategories: React.FC = () => {
    const navigate = useNavigate();
    const BASE_URL: string = import.meta.env.VITE_API_URL as string;
    const imgURL = BASE_URL + "/upload/150_";
    const columns: ColumnsType<ICategoryItem> = [
        {
            title: 'Id',
            dataIndex: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
        },
        {
            title: 'Image',
            dataIndex: 'image',
            render: (imageName: string) => (
                <img src={`${imgURL}${imageName}`} alt="Category Image"/>
            ),
        },
        {
            title: 'Edit',
            dataIndex: 'edit',
            render: (_, record) => (

                <Button type="primary" onClick={() => handleEdit(record.id)} icon={<EditOutlined/>}>
                    Edit
                </Button>

            ),
        },
        {
            title: 'Delete',
            dataIndex: 'delete',
            render: (_, record) => (

                <Popconfirm
                    title="Are you sure to delete this category?"
                    onConfirm={() => handleDelete(record.id)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button icon={<DeleteOutlined/>}>
                        Delete
                    </Button>
                </Popconfirm>

            ),
        },
    ];

    const handleEdit = (categoryId: number) => {
        navigate(`/categories/edit/${categoryId}`);
    };

    const handleDelete = async (categoryId: number) => {
        await deleteCategory(Number(categoryId));
        window.location.reload();
    };

    const [data, setData] = useState<ICategoryItem[]>([]);
    useEffect(() => {
        const fetchDataAndDoSomething = async () => {
            try {
                const fetchedData: ICategoryItem[] = await fetchData();
                // Update the state with the fetched data
                setData(fetchedData);
            } catch (error) {
                throw error;
            }
        };

        fetchDataAndDoSomething();
    }, []); // The empty dependency array means this effect runs once when the component mounts

    return (
        <div>
            <Divider>Category list</Divider>
            <Button type="primary" onClick={() => navigate("/categories/add")} style={{margin: '5px'}}>ADD +</Button>
            <Table columns={columns} rowKey={"id"} dataSource={data} size="middle"/>
        </div>
    );
};

export default GetCategories;


